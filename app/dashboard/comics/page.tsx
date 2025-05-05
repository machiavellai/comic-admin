import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"

// Mock data for comics
const comics = [
  {
    id: 1,
    title: "Superhero Origins",
    author: "John Smith",
    genre: "Action",
    status: "Published",
    updatedAt: "2023-04-01",
  },
  {
    id: 2,
    title: "Space Adventures",
    author: "Emily Johnson",
    genre: "Sci-Fi",
    status: "Published",
    updatedAt: "2023-03-28",
  },
  {
    id: 3,
    title: "Mystery Tales",
    author: "David Brown",
    genre: "Mystery",
    status: "Published",
    updatedAt: "2023-03-25",
  },
  {
    id: 4,
    title: "Fantasy World",
    author: "Sarah Wilson",
    genre: "Fantasy",
    status: "Draft",
    updatedAt: "2023-03-20",
  },
  {
    id: 5,
    title: "Historical Heroes",
    author: "Michael Davis",
    genre: "Historical",
    status: "Published",
    updatedAt: "2023-03-15",
  },
]

export default function ComicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comics</h1>
          <p className="text-muted-foreground">Manage your comic book collection</p>
        </div>
        <Link href="/dashboard/comics/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Comic
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comics</CardTitle>
          <CardDescription>A list of all comics in your database.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comics.map((comic) => (
                <TableRow key={comic.id}>
                  <TableCell className="font-medium">{comic.title}</TableCell>
                  <TableCell>{comic.author}</TableCell>
                  <TableCell>{comic.genre}</TableCell>
                  <TableCell>
                    <Badge variant={comic.status === "Published" ? "default" : "secondary"}>{comic.status}</Badge>
                  </TableCell>
                  <TableCell>{comic.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/comics/${comic.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
