"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2, Upload, Layers, BookOpen, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Categories for comics
const comicCategories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Historical",
]

// Mock data for comics
const mockComics = [
  {
    id: 1,
    title: "The Amazing Adventures",
    category: "Adventure",
    releaseDate: "2023-04-15",
    description: "Follow the journey of our hero as they navigate through perilous challenges.",
    icloudLink: "https://www.icloud.com/link1",
    hasImage: true,
    issues: [
      {
        id: 101,
        issue: "Issue #1",
        releaseDate: "2023-04-15",
        description: "The beginning of an epic journey.",
        icloudLink: "https://www.icloud.com/link1-1",
      },
      {
        id: 102,
        issue: "Issue #2",
        releaseDate: "2023-05-15",
        description: "The adventure continues as our hero faces new challenges.",
        icloudLink: "https://www.icloud.com/link1-2",
      },
      {
        id: 103,
        issue: "Issue #3",
        releaseDate: "2023-06-15",
        description: "The plot thickens as secrets are revealed.",
        icloudLink: "https://www.icloud.com/link1-3",
      },
    ],
  },
  {
    id: 2,
    title: "Mystery of the Dark Forest",
    category: "Mystery",
    releaseDate: "2023-05-20",
    description: "A thrilling mystery set in the depths of an ancient forest.",
    icloudLink: "https://www.icloud.com/link2",
    hasImage: true,
    issues: [
      {
        id: 201,
        issue: "Issue #1",
        releaseDate: "2023-05-20",
        description: "Strange occurrences begin in the forest.",
        icloudLink: "https://www.icloud.com/link2-1",
      },
    ],
  },
  {
    id: 3,
    title: "Space Explorers",
    category: "Sci-Fi",
    releaseDate: "2023-06-10",
    description: "Join the crew as they explore the furthest reaches of the galaxy.",
    icloudLink: "https://www.icloud.com/link3",
    hasImage: true,
    issues: [],
  },
  {
    id: 4,
    title: "Heroes United",
    category: "Adventure",
    releaseDate: "2023-07-05",
    description: "The greatest heroes come together to face an unprecedented threat.",
    icloudLink: "https://www.icloud.com/link4",
    hasImage: false,
    issues: [
      {
        id: 401,
        issue: "Issue #1",
        releaseDate: "2023-07-05",
        description: "The heroes meet for the first time.",
        icloudLink: "https://www.icloud.com/link4-1",
      },
      {
        id: 402,
        issue: "Issue #2",
        releaseDate: "2023-08-05",
        description: "The team faces their first challenge.",
        icloudLink: "https://www.icloud.com/link4-2",
      },
    ],
  },
]

export default function EditComicPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [comic, setComic] = useState<any>(null)
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    category: "",
    releaseDate: "",
    description: "",
    icloudLink: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    // Find the comic with the matching ID
    const comicId = Number.parseInt(params.id)
    const foundComic = mockComics.find((c) => c.id === comicId)

    if (foundComic) {
      setComic(foundComic)
      setFormData({
        id: foundComic.id,
        title: foundComic.title,
        category: foundComic.category,
        releaseDate: foundComic.releaseDate,
        description: foundComic.description,
        icloudLink: foundComic.icloudLink,
      })
    } else {
      // Comic not found, redirect to dashboard
      toast({
        title: "COMIC NOT FOUND",
        description: "The comic you're looking for doesn't exist",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("Updating:", formData)

    setTimeout(() => {
      setIsLoading(false)

      // Show success toast
      toast({
        title: "ZAP! COMIC UPDATED!",
        description: `"${formData.title}" has been updated successfully`,
        duration: 5000,
      })

      router.push("/dashboard")
    }, 1000)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comic? This will also delete all issues.")) {
      setIsLoading(true)

      console.log("Deleting comic ID:", formData.id)

      setTimeout(() => {
        setIsLoading(false)

        // Show success toast
        toast({
          title: "COMIC DELETED!",
          description: `"${formData.title}" has been removed from your collection`,
          duration: 5000,
        })

        router.push("/dashboard")
      }, 1000)
    }
  }

  const handleDeleteIssue = async (issueId: number) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      setIsLoading(true)

      console.log("Deleting issue ID:", issueId)

      // Find the issue to get its name
      const issue = comic.issues.find((i: any) => i.id === issueId)
      const issueName = issue ? issue.issue : "Issue"

      setTimeout(() => {
        setIsLoading(false)

        // Show success toast
        toast({
          title: "ISSUE DELETED!",
          description: `"${issueName}" has been removed from "${comic.title}"`,
          duration: 5000,
        })

        // Refresh the comic data
        const updatedComic = { ...comic }
        updatedComic.issues = comic.issues.filter((issue: any) => issue.id !== issueId)
        setComic(updatedComic)
      }, 1000)
    }
  }

  if (!comic) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="mr-4 comic-panel">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="comic-heading text-4xl text-black">EDIT COMIC</h1>
          <p className="text-muted-foreground">{comic.title}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="comic-panel">
          <TabsTrigger value="details" className="comic-button">
            DETAILS
          </TabsTrigger>
          <TabsTrigger value="issues" className="comic-button">
            ISSUES
            {comic.issues.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {comic.issues.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="comic-panel p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border-2 border-black h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-lg">
                  Category
                </Label>
                <Select
                  value={formData.category.toLowerCase()}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className="border-2 border-black h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {comicCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate" className="text-lg">
                  Release Date
                </Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="border-2 border-black h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border-2 border-black min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icloudLink" className="text-lg">
                  iCloud Drive Link
                </Label>
                <Input
                  id="icloudLink"
                  name="icloudLink"
                  value={formData.icloudLink}
                  onChange={handleChange}
                  className="border-2 border-black h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg">Cover Image</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-black rounded-lg p-12 text-center">
                  {comic.hasImage ? (
                    <div className="text-center">
                      <div className="w-32 h-48 bg-muted mx-auto mb-4 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm" className="comic-button">
                        REPLACE IMAGE
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No image uploaded yet. Drag and drop or click to browse.
                      </p>
                      <Button variant="outline" size="sm" className="comic-button">
                        UPLOAD IMAGE
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 800x1200px. Max file size: 5MB.</p>
              </div>

              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="comic-button gap-2 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-5 w-5" />
                  DELETE
                </Button>

                <div className="flex gap-4">
                  <Link href="/dashboard">
                    <Button type="button" variant="outline" className="comic-button">
                      CANCEL
                    </Button>
                  </Link>
                  <Button type="submit" className="comic-button gap-2" disabled={isLoading}>
                    <Save className="h-5 w-5" />
                    {isLoading ? "SAVING..." : "SAVE CHANGES"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card className="comic-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="comic-heading text-2xl">ISSUES</h2>
              <Link href={`/dashboard/add?parent=${comic.id}`}>
                <Button className="comic-button gap-2">
                  <Plus className="h-5 w-5" />
                  ADD ISSUE
                </Button>
              </Link>
            </div>

            {comic.issues.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-black rounded-lg">
                <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="comic-heading text-xl mb-2">NO ISSUES YET</h3>
                <p className="text-muted-foreground mb-6">Add your first issue to this comic</p>
                <Link href={`/dashboard/add?parent=${comic.id}`}>
                  <Button className="comic-button gap-2">
                    <Plus className="h-5 w-5" />
                    ADD ISSUE
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {comic.issues.map((issue: any) => (
                  <div key={issue.id} className="border-2 border-black p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="comic-heading text-xl">{issue.issue}</h3>
                        <p className="text-sm text-muted-foreground">
                          Released: {new Date(issue.releaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteIssue(issue.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm">{issue.description}</p>
                    <div className="mt-3 text-sm">
                      <span className="font-medium">iCloud Link:</span>{" "}
                      <span className="text-muted-foreground">{issue.icloudLink}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
