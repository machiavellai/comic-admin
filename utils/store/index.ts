import { supabase } from "@/lib/supabase";
import { Book, ComicIssue, User } from "@/types/types";
import { create } from 'zustand';

type State = {
    books: Book[];
    user: User | null;
    issues: { [bookId: string]: ComicIssue[] };
    loading: boolean;
    error: string | null;
    fetchBooks: () => Promise<void>;
    fetchUser: () => Promise<void>;
    fetchIssues: (bookId: string) => Promise<void>;
    clearBooks: () => void;
};

export const useStore = create<State>((set) => ({
    user: null,
    books: [],
    issues: {},
    loading: false,
    error: null,

    fetchBooks: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('books')
            .select('*')
            .is('parent_id', null) // Only fetch parent comics
            .order('created_at', { ascending: false });
    
          if (error) throw error;
    
          set({ books: data as Book[] });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to fetch books' });
        } finally {
          set({ loading: false });
        }
      },
    
      fetchIssues: async (bookId: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('comic_issues')
            .select('*')
            .eq('book_id', bookId)
            .order('issue_number', { ascending: true });
    
          if (error) throw error;
    
          set((state) => ({
            issues: {
              ...state.issues,
              [bookId]: data as ComicIssue[],
            },
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to fetch issues' });
        } finally {
          set({ loading: false });
        }
      },
    
    fetchUser: async () => {
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            if (authError) throw new Error(`Failed to fetch auth user: ${authError.message}`);
            if (!authUser) {
                set({ user: null });
                return;
            }
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error) {
                throw new Error(`Supabase error: ${error.message}, code: ${error.code}, details: ${error.details}`);
            }

            if (!data) {
                throw new Error(`No user found in 'users' table for id: ${authUser.id}`);
            }

            set({ user: data });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching user';
            console.error('Error fetching user:', errorMessage);
            set({ user: null });
        }
    },
    clearBooks: () => set({ books: [], loading: false, error: null }),
}));