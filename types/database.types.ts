export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          name: string;
          subscribed: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: string;
          name: string;
          subscribed?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          name: string;
          subscribed?: boolean | null;
          created_at?: string;
        };
      };
      // Other tables (e.g., books, comic_issues)
    };
  };
}