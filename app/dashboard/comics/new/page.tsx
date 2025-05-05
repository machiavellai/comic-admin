"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Save, Plus } from "lucide-react"
import Link from "next/link"

export default function NewComicPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [comicData, setComicData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    status: "draft",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setComicData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setComicData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would send this data to your API
    console.log("Submitting comic data:", comicData)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/comics")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/comics">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Comic</h1>
          <p className="text-muted-foreground">Create a new comic book entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Comic Details</CardTitle>
              <CardDescription>Enter the basic information about the comic book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter comic title"
                  value={comicData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Enter author name"
                  value={comicData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="genre">Genre</Label>
                <Select onValueChange={(value) => handleSelectChange("genre", value)} defaultValue={comicData.genre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                    <SelectItem value="thriller">Thriller</SelectItem>
                    <SelectItem value="historical">Historical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter comic description"
                  rows={5}
                  value={comicData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>Upload a cover image for the comic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                  <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop an image or click to browse</p>
                  <Button variant="secondary" size="sm">
                    Upload Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>Manage publishing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("status", value)}
                    defaultValue={comicData.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Comic"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Comic Content</CardTitle>
          <CardDescription>Manage the pages and content of your comic book</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pages">
            <TabsList className="mb-4">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="pages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Comic Pages</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Page
                </Button>
              </div>
              <div className="text-center p-12 border rounded-lg">
                <p className="text-muted-foreground">No pages added yet. Click "Add Page" to get started.</p>
              </div>
            </TabsContent>
            <TabsContent value="chapters" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Comic Chapters</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              </div>
              <div className="text-center p-12 border rounded-lg">
                <p className="text-muted-foreground">No chapters added yet. Click "Add Chapter" to get started.</p>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <div className="text-center p-12 border rounded-lg">
                <p className="text-muted-foreground">Preview will be available after adding content to your comic.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
