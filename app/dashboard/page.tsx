"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Calendar, BookOpen, Layers, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useStore } from "@/utils/store"
import { supabase } from "@/lib/supabase"
import { Book } from "@/types/types"
import { useToast } from "@/hooks/use-toast"


export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const {
    books,
    user,
    issues,
    loading,
    error,
    fetchBooks,
    fetchIssues,
    fetchUser,
    clearBooks } = useStore();
  const router = useRouter();
  const { toast } = useToast();

  // Run auth and books fetch only once on mount
  useEffect(() => {
    let mounted = true;

    const checkAuthAndFetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          clearBooks();
          router.push('/login');
          return;
        }
        if (!user && mounted) {
          await fetchUser();
        }
        if (mounted) {
          await fetchBooks();
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        if (mounted) {
          clearBooks();
          router.push('/login');
        }
      }
    };

    checkAuthAndFetchData();

    return () => {
      mounted = false;
    };
  }, [fetchBooks, fetchUser, clearBooks, router]);

  // Fetch issues only when books change and avoid re-fetching existing issues
  useEffect(() => {
    if (books.length > 0) {
      books.forEach((book) => {
        if (!issues[book.id]) {
          fetchIssues(book.id);
        }
      });
    }
  }, [books, fetchIssues]);

  // Log state changes for debugging (remove in production)
  useEffect(() => {
    console.log('Books:', books);
    console.log('Issues:', issues);
    console.log('Error:', error);
    console.log('User:', user);
  }, [books, issues, error, user]);

  // Delete book handler
  const handleDeleteBook = async (bookId: string) => {
    if (!user || user.role !== 'admin') {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can delete books.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete the book "${books.find((b) => b.id === bookId)?.name}"? This will also delete all associated issues.`)) {
      return;
    }

    try {
      // Delete all issues associated with the book first
      await supabase.from('comic_issues').delete().eq('book_id', bookId);

      // Delete the book
      const { error } = await supabase.from('books').delete().eq('id', bookId);

      if (error) throw error;

      // Refresh the store
      await fetchBooks();
      toast({
        title: 'Book Deleted!',
        description: 'The book and its issues have been successfully deleted.',
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete book',
        variant: 'destructive',
      });
    }
  };

  // Delete issue handler
  const handleDeleteIssue = async (issueId: string, bookId: string) => {
    if (!user || user.role !== 'admin') {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can delete issues.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete issue "${issues[bookId].find((i) => i.id === issueId)?.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.from('comic_issues').delete().eq('id', issueId);

      if (error) throw error;

      // Refresh issues for the book
      await fetchIssues(bookId);
      toast({
        title: 'Issue Deleted!',
        description: 'The issue has been successfully deleted.',
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete issue',
        variant: 'destructive',
      });
    }
  };

  // // Check if user is an admin
  // if (user && user.role !== 'admin') {
  //   router.push('/login');
  //   return null;
  // }

  // const { user, role, isLoading } = useAuth();

  // useEffect(() => {
  //   if (!isLoading && (!user || role !== 'admin')) {
  //     router.push('/login');
  //   }
  // }, [user, role, isLoading, router]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!user || role !== 'admin') {
  //   return null;
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="comic-heading text-4xl text-black mb-1">YOUR COMICS</h1>
          <p className="text-muted-foreground">Manage your comic book collection</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className="comic-button"
          >
            GRID
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="comic-button"
          >
            LIST
          </Button>
          <Link href="/dashboard/add">
            <Button className="comic-button gap-2">
              <Plus className="h-5 w-5" />
              <span>ADD COMIC</span>
            </Button>
          </Link>
        </div>
      </div>

      {loading && <div>Loading books...</div>}
      {error && <div className="text-destructive">{error}</div>}

      {!loading && !error && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const bookIssues = issues[book.id] || [];
            return (
              <Card key={book.id} className="comic-panel overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="comic-heading text-2xl mb-1">{book.name}</h2>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="font-medium">
                          {book.category}
                        </Badge>
                        {bookIssues.length > 0 && (
                          <Badge variant="secondary" className="font-medium flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            {bookIssues.length} {bookIssues.length === 1 ? 'Issue' : 'Issues'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/edit/${book.id}`}>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-5 w-5" />
                        </Button>
                      </Link>
                      {user?.role === 'admin' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {book.created_at
                        ? new Date(book.created_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>

                  <p className="text-sm line-clamp-3">{book.description}</p>

                  {bookIssues.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Issues:</h3>
                      <div className="space-y-2">
                        {bookIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="border-l-2 border-muted pl-2 text-sm"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">
                                  Issue #{issue.issue_number}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/dashboard/edit/${issue.id}`}>
                                  <Button size="sm" variant="outline" className="comic-button">
                                    Edit
                                  </Button>
                                </Link>
                                {user?.role === 'admin' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteIssue(issue.id, book.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground line-clamp-1">{issue.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-muted p-4 border-t border-border flex gap-2">
                  <Link href={`/dashboard/edit/${book.id}`} className="flex-1">
                    <Button variant="outline" className="comic-button w-full">
                      EDIT COMIC
                    </Button>
                  </Link>
                  <Link href={`/dashboard/add?parent_id=${book.id}`} className="flex-shrink-0">
                    <Button variant="default" className="comic-button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && !error && viewMode === 'list' && (
        <Card className="comic-panel overflow-hidden">
          <div className="divide-y divide-border">
            {books.map((book) => {
              const bookIssues = issues[book.id] || [];
              return (
                <div key={book.id} className="p-4 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <h3 className="comic-heading text-xl">{book.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                        <Badge variant="outline" className="font-medium">
                          {book.category}
                        </Badge>
                        {bookIssues.length > 0 && (
                          <Badge variant="secondary" className="font-medium flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            {bookIssues.length} {bookIssues.length === 1 ? 'Issue' : 'Issues'}
                          </Badge>
                        )}
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {book.created_at
                            ? new Date(book.created_at).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/dashboard/add?parent_id=${book.id}`}>
                        <Button variant="outline" className="comic-button">
                          <Plus className="h-4 w-4 mr-1" />
                          ADD ISSUE
                        </Button>
                      </Link>
                      <Link href={`/dashboard/edit/${book.id}`}>
                        <Button className="comic-button">EDIT</Button>
                      </Link>
                      {user?.role === 'admin' && (
                        <Button
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          DELETE
                        </Button>
                      )}
                    </div>
                  </div>

                  {bookIssues.length > 0 && (
                    <div className="mt-2">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Issues:</h3>
                      <div className="space-y-2 pl-4">
                        {bookIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="border-l-2 border-muted pl-2 text-sm"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">
                                  Issue #{issue.issue_number}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/dashboard/edit/${issue.id}`}>
                                  <Button size="sm" variant="outline" className="comic-button">
                                    Edit
                                  </Button>
                                </Link>
                                {user?.role === 'admin' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteIssue(issue.id, book.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground line-clamp-1">{issue.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-12">
          <h3 className="comic-heading text-2xl mb-2">NO COMICS YET!</h3>
          <p className="text-muted-foreground mb-6">Add your first comic to get started</p>
          <Link href="/dashboard/add">
            <Button className="comic-button gap-2">
              <Plus className="h-5 w-5" />
              <span>ADD COMIC</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
