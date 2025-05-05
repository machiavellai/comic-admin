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
import { ArrowLeft, Save, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

// Mock data for existing comics
const existingComics = [
  { id: 1, title: "The Amazing Adventures", category: "Adventure" },
  { id: 2, title: "Mystery of the Dark Forest", category: "Mystery" },
  { id: 3, title: "Space Explorers", category: "Sci-Fi" },
  { id: 4, title: "Heroes United", category: "Adventure" },
]

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

export default function AddComicPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isNewIssue, setIsNewIssue] = useState(false)
  const [selectedComic, setSelectedComic] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    releaseDate: "",
    description: "",
    icloudLink: "",
    issue: "",
    parentComicId: null as number | null,
  })

  // Reset form fields when switching between new comic and new issue
  useEffect(() => {
    if (isNewIssue) {
      setFormData((prev) => ({
        ...prev,
        title: "",
        category: "",
        parentComicId: null,
      }))
      setSelectedComic(null)
    } else {
      setFormData((prev) => ({
        ...prev,
        parentComicId: null,
        issue: "",
      }))
    }
  }, [isNewIssue])

  // Update form when selecting a parent comic
  useEffect(() => {
    if (selectedComic) {
      const comic = existingComics.find((c) => c.id.toString() === selectedComic)
      if (comic) {
        setFormData((prev) => ({
          ...prev,
          title: comic.title,
          category: comic.category,
          parentComicId: comic.id,
        }))
      }
    }
  }, [selectedComic])

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

    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "MISSING TITLE",
        description: "Please enter a title for your comic",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (isNewIssue && !formData.issue.trim()) {
      toast({
        title: "MISSING ISSUE",
        description: "Please enter an issue number or name",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    console.log("Submitting:", { ...formData, isNewIssue })

    setTimeout(() => {
      setIsLoading(false)

      // Show success toast with comic-themed message
      if (isNewIssue) {
        toast({
          title: "BOOM! NEW ISSUE ADDED!",
          description: `"${formData.issue}" has been added to "${formData.title}"`,
          duration: 5000,
        })
      } else {
        toast({
          title: "POW! NEW COMIC CREATED!",
          description: `"${formData.title}" has been added to your collection`,
          duration: 5000,
        })
      }

      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="mr-4 comic-panel">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="comic-heading text-4xl text-black">{isNewIssue ? "ADD NEW ISSUE" : "ADD NEW COMIC"}</h1>
      </div>

      <Card className="comic-panel p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <Label htmlFor="isNewIssue" className="text-lg font-medium">
            Is this a new issue of an existing comic?
          </Label>
          <Switch id="isNewIssue" checked={isNewIssue} onCheckedChange={setIsNewIssue} />
        </div>

        {isNewIssue && (
          <div className="mb-6">
            <Label htmlFor="parentComic" className="text-lg mb-2 block">
              Select Parent Comic
            </Label>
            <Select value={selectedComic || ""} onValueChange={(value) => setSelectedComic(value)}>
              <SelectTrigger className="border-2 border-black h-12">
                <SelectValue placeholder="Select a comic" />
              </SelectTrigger>
              <SelectContent>
                {existingComics.map((comic) => (
                  <SelectItem key={comic.id} value={comic.id.toString()}>
                    {comic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Card>

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
              placeholder="The Amazing Adventures"
              required
              disabled={isNewIssue && selectedComic !== null}
            />
          </div>

          {isNewIssue && (
            <div className="space-y-2">
              <Label htmlFor="issue" className="text-lg">
                Issue Number/Name
              </Label>
              <Input
                id="issue"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                className="border-2 border-black h-12"
                placeholder="Issue #1 or 'The Beginning'"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category" className="text-lg">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              disabled={isNewIssue && selectedComic !== null}
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
              placeholder="Enter a description of the comic..."
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
              placeholder="https://www.icloud.com/..."
              required
            />
          </div>

          {!isNewIssue && (
            <div className="space-y-2">
              <Label className="text-lg">Cover Image</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-black rounded-lg p-12 text-center">
                <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop an image or click to browse</p>
                <Button variant="outline" size="sm" className="comic-button">
                  UPLOAD IMAGE
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Recommended size: 800x1200px. Max file size: 5MB.</p>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/dashboard">
              <Button type="button" variant="outline" className="comic-button">
                CANCEL
              </Button>
            </Link>
            <Button type="submit" className="comic-button gap-2" disabled={isLoading}>
              <Save className="h-5 w-5" />
              {isLoading ? "SAVING..." : isNewIssue ? "PUBLISH ISSUE" : "PUBLISH COMIC"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
