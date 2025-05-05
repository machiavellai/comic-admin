"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Calendar, BookOpen, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

// Mock data for comics
const mockComics = [
  {
    id: 1,
    title: "The Amazing Adventures",
    category: "Adventure",
    releaseDate: "2023-04-15",
    description: "Follow the journey of our hero as they navigate through perilous challenges.",
    icloudLink: "https://www.icloud.com/link1",
    issueCount: 3,
    hasImage: true,
  },
  {
    id: 2,
    title: "Mystery of the Dark Forest",
    category: "Mystery",
    releaseDate: "2023-05-20",
    description: "A thrilling mystery set in the depths of an ancient forest.",
    icloudLink: "https://www.icloud.com/link2",
    issueCount: 1,
    hasImage: true,
  },
  {
    id: 3,
    title: "Space Explorers",
    category: "Sci-Fi",
    releaseDate: "2023-06-10",
    description: "Join the crew as they explore the furthest reaches of the galaxy.",
    icloudLink: "https://www.icloud.com/link3",
    issueCount: 0,
    hasImage: true,
  },
  {
    id: 4,
    title: "Heroes United",
    category: "Adventure",
    releaseDate: "2023-07-05",
    description: "The greatest heroes come together to face an unprecedented threat.",
    icloudLink: "https://www.icloud.com/link4",
    issueCount: 2,
    hasImage: false,
  },
]

export default function Dashboard() {
  const [comics, setComics] = useState(mockComics)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // const { user, role, isLoading } = useAuth();
  // const router = useRouter();

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
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
            className="comic-button"
          >
            GRID
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
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

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comics.map((comic) => (
            <Card key={comic.id} className="comic-panel overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="comic-heading text-2xl mb-1">{comic.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="font-medium">
                        {comic.category}
                      </Badge>
                      {comic.issueCount > 0 && (
                        <Badge variant="secondary" className="font-medium flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {comic.issueCount} {comic.issueCount === 1 ? "Issue" : "Issues"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Link href={`/dashboard/edit/${comic.id}`}>
                    <Button size="icon" variant="ghost">
                      <Edit className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(comic.releaseDate).toLocaleDateString()}</span>
                </div>

                <p className="text-sm line-clamp-3">{comic.description}</p>
              </div>

              <div className="bg-muted p-4 border-t border-border flex gap-2">
                <Link href={`/dashboard/edit/${comic.id}`} className="flex-1">
                  <Button variant="outline" className="comic-button w-full">
                    EDIT COMIC
                  </Button>
                </Link>
                <Link href={`/dashboard/add?parent=${comic.id}`} className="flex-shrink-0">
                  <Button variant="default" className="comic-button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="comic-panel overflow-hidden">
          <div className="divide-y divide-border">
            {comics.map((comic) => (
              <div key={comic.id} className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="comic-heading text-xl">{comic.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                    <Badge variant="outline" className="font-medium">
                      {comic.category}
                    </Badge>
                    {comic.issueCount > 0 && (
                      <Badge variant="secondary" className="font-medium flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {comic.issueCount} {comic.issueCount === 1 ? "Issue" : "Issues"}
                      </Badge>
                    )}
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(comic.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link href={`/dashboard/add?parent=${comic.id}`}>
                    <Button variant="outline" className="comic-button">
                      <Plus className="h-4 w-4 mr-1" />
                      ADD ISSUE
                    </Button>
                  </Link>
                  <Link href={`/dashboard/edit/${comic.id}`}>
                    <Button className="comic-button">EDIT</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {comics.length === 0 && (
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
