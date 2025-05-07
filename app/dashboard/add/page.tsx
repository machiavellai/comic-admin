"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { useForm } from "react-hook-form"
import { BookFormData, bookSchema } from "@/schema/bookSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from "@/lib/supabase"
import { IssueFormData, issueSchema } from "@/schema/issueSchema"

export default function AddComicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parent_id');
  const { toast } = useToast();

  // Form for adding a new comic (books table)
  const bookForm = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 5,
      index: undefined,
      category: 'graphic_novel',
    },
  });

  // Form for adding a new issue (comic_issues table)
  const issueForm = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      issue_number: 1,
      title: '',
      storage_path: '',
    },
  });

  const coverImage = bookForm.watch('coverImage');

  useEffect(() => {
    if (parentId) {
      const fetchParentComic = async () => {
        const { data, error } = await supabase
          .from('books')
          .select('name')
          .eq('id', parentId)
          .single();

        if (error) {
          toast({
            title: 'ERROR',
            description: 'Failed to load parent comic.',
            variant: 'destructive',
          });
          return;
        }

        if (data) {
          // Suggest a title based on the parent comic's name
          issueForm.reset({
            issue_number: 1,
            title: `${data.name} #1`,
            storage_path: '',
          });
        }
      };
      fetchParentComic();
    }
  }, [parentId, issueForm, toast]);

  // Handle adding a new comic
  const onSubmitComic = async (data: BookFormData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'AUTH ERROR',
          description: 'You must be logged in to add a comic.',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      let coverImageUrl = null;
      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('comic-cover')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('comic-cover')
          .getPublicUrl(fileName);

        coverImageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('books').insert({
        name: data.name,
        Cover_Image: coverImageUrl || null,
        description: data.description,
        price: data.price ? [{ price: data.price.toString(), currency: 'USD' }] : null,
        index: data.index || null,
        category: data.category,
        parent_id: null,
      });

      if (error) throw error;

      toast({
        title: 'POW! COMIC CREATED!',
        description: `"${data.name}" has been added to your collection`,
        duration: 5000,
      });

      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comic';
      toast({
        title: 'ERROR',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Handle adding a new issue
  const onSubmitIssue = async (data: IssueFormData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'AUTH ERROR',
          description: 'You must be logged in to add an issue.',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      const { error } = await supabase.from('comic_issues').insert({
        book_id: parentId,
        issue_number: data.issue_number,
        title: data.title,
        storage_path: data.storage_path,
        description: null, // Not used, but included since it's in the table schema
      });

      if (error) throw error;

      toast({
        title: 'BOOM! ISSUE ADDED!',
        description: `Issue "${data.title}" has been added`,
        duration: 5000,
      });

      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add issue';
      toast({
        title: 'ERROR',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="mr-4 comic-panel">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="comic-heading text-4xl text-black">
          {parentId ? 'ADD NEW ISSUE' : 'ADD NEW COMIC'}
        </h1>
      </div>

      <Card className="comic-panel p-6">
        {parentId ? (
          // Form for adding a new issue
          <form onSubmit={issueForm.handleSubmit(onSubmitIssue)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="issue_number" className="text-lg">
                Issue Number
              </Label>
              <Input
                id="issue_number"
                type="number"
                {...issueForm.register('issue_number', { valueAsNumber: true })}
                className="border-2 border-black h-12"
                placeholder="1"
              />
              {issueForm.formState.errors.issue_number && (
                <p className="text-destructive text-sm">
                  {issueForm.formState.errors.issue_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg">
                Title
              </Label>
              <Input
                id="title"
                {...issueForm.register('title')}
                className="border-2 border-black h-12"
                placeholder="A7 #1"
              />
              {issueForm.formState.errors.title && (
                <p className="text-destructive text-sm">
                  {issueForm.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage_path" className="text-lg">
                Storage Path (URL)
              </Label>
              <Input
                id="storage_path"
                {...issueForm.register('storage_path')}
                className="border-2 border-black h-12"
                placeholder="https://s3.us-east-005.backblazeb2.com/..."
              />
              {issueForm.formState.errors.storage_path && (
                <p className="text-destructive text-sm">
                  {issueForm.formState.errors.storage_path.message}
                </p>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline" className="comic-button">
                  CANCEL
                </Button>
              </Link>
              <Button
                type="submit"
                className="comic-button gap-2"
                disabled={issueForm.formState.isSubmitting}
              >
                <Save className="h-5 w-5" />
                {issueForm.formState.isSubmitting ? 'SAVING...' : 'PUBLISH ISSUE'}
              </Button>
            </div>
          </form>
        ) : (
          // Form for adding a new comic
          <form onSubmit={bookForm.handleSubmit(onSubmitComic)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                Title
              </Label>
              <Input
                id="name"
                {...bookForm.register('name')}
                className="border-2 border-black h-12"
                placeholder="The Anointed 7"
              />
              {bookForm.formState.errors.name && (
                <p className="text-destructive text-sm">
                  {bookForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg">
                Description
              </Label>
              <Textarea
                id="description"
                {...bookForm.register('description')}
                className="border-2 border-black min-h-[120px]"
                placeholder="Enter a description of the comic..."
              />
              {bookForm.formState.errors.description && (
                <p className="text-destructive text-sm">
                  {bookForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-lg">
                Price (USD)
              </Label>
              <Input
                id="price"
                {...bookForm.register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="border-2 border-black h-12"
                placeholder="5.00"
              />
              {bookForm.formState.errors.price && (
                <p className="text-destructive text-sm">
                  {bookForm.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="index" className="text-lg">
                Issue Index (for comic issues, optional)
              </Label>
              <Input
                id="index"
                {...bookForm.register('index', { valueAsNumber: true })}
                type="number"
                className="border-2 border-black h-12"
                placeholder="1"
              />
              {bookForm.formState.errors.index && (
                <p className="text-destructive text-sm">
                  {bookForm.formState.errors.index.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg">
                Category
              </Label>
              <Select {...bookForm.register('category')} defaultValue="graphic_novel">
                <SelectTrigger className="border-2 border-black h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graphic_novel">Graphic Novel</SelectItem>
                  <SelectItem value="comic_issue">Comic Issue</SelectItem>
                </SelectContent>
              </Select>
              {bookForm.formState.errors.category && (
                <p className="text-destructive text-sm">
                  {bookForm.formState.errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage" className="text-lg">
                Cover Image
              </Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/jpeg,image/png"
                {...bookForm.register('coverImage', { required: false })}
                className="border-2 border-black h-12"
              />
              {bookForm.formState.errors.coverImage && (
                <p className="text-destructive text-sm">
                  {bookForm.formState.errors.coverImage.message as string}
                </p>
              )}
              {coverImage && coverImage.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Selected: {coverImage[0].name}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Recommended size: 800x1200px. Max file size: 5MB.
              </p>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline" className="comic-button">
                  CANCEL
                </Button>
              </Link>
              <Button
                type="submit"
                className="comic-button gap-2"
                disabled={bookForm.formState.isSubmitting}
              >
                <Save className="h-5 w-5" />
                {bookForm.formState.isSubmitting ? 'SAVING...' : 'PUBLISH COMIC'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
