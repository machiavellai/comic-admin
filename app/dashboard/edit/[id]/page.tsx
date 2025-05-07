"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Book } from "@/types/types"
import { useForm } from "react-hook-form"
import { BookFormData, bookSchema } from "@/schema/bookSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from "@/lib/supabase"



export default function EditComicPage() {
  const router = useRouter()
  const params = useParams();
  const { id } = params as { id: string };
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [comic, setComic] = useState<Book | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'graphic_novel',
    },
  });

  const coverImage = watch('coverImage');

  useEffect(() => {
    const fetchComic = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setComic(data as Book);
        reset({
          name: data.name,
          description: data.description,
          price: data.price?.[0]?.price ? parseFloat(data.price[0].price) : 0,
          category: data.category,
        });
      } catch (err) {
        toast({
          title: 'ERROR',
          description: err instanceof Error ? err.message : 'Failed to load comic',
          variant: 'destructive',
        });
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComic();
  }, [id, router, toast, reset]);

  const onSubmit = async (data: BookFormData) => {
    try {
      setIsLoading(true);

      let coverImageUrl = comic?.Cover_Image || null;
      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        if (comic?.Cover_Image) {
          const oldFileName = comic.Cover_Image.split('/').pop();
          await supabase.storage.from('comic-cover').remove([oldFileName!]);
        }

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

      const { error } = await supabase
        .from('books')
        .update({
          name: data.name,
          Cover_Image: coverImageUrl,
          description: data.description,
          price: data.price ? [{ price: data.price.toString(), currency: 'USD' }] : null,
          category: data.category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'ZAP! COMIC UPDATED!',
        description: `"${data.name}" has been updated successfully`,
        duration: 5000,
      });

      router.push('/dashboard');
    } catch (err) {
      toast({
        title: 'ERROR',
        description: err instanceof Error ? err.message : 'Failed to update comic',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comic?')) {
      try {
        setIsLoading(true);

        if (comic?.Cover_Image) {
          const fileName = comic.Cover_Image.split('/').pop();
          await supabase.storage.from('comic-cover').remove([fileName!]);
        }

        const { error } = await supabase
          .from('books')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'COMIC DELETED!',
          description: `"${comic?.name}" has been removed from your collection`,
          duration: 5000,
        });

        router.push('/dashboard');
      } catch (err) {
        toast({
          title: 'ERROR',
          description: err instanceof Error ? err.message : 'Failed to delete comic',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading || !comic) {
    return <div>Loading...</div>;
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
          <p className="text-muted-foreground">{comic.name}</p>
        </div>
      </div>

      <Card className="comic-panel p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">
              Title
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="border-2 border-black h-12"
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              className="border-2 border-black min-h-[120px]"
            />
            {errors.description && (
              <p className="text-destructive text-sm">{errors.description.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-lg">
              Price (USD)
            </Label>
            <Input
              id="price"
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="border-2 border-black h-12"
            />
            {errors.price && <p className="text-destructive text-sm">{errors.price.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-lg">
              Category
            </Label>
            <Select {...register('category')} defaultValue={comic.category}>
              <SelectTrigger className="border-2 border-black h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="graphic_novel">Graphic Novel</SelectItem>
                <SelectItem value="comic_issue">Comic Issue</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-destructive text-sm">{errors.category.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Cover Image</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-black rounded-lg p-12 text-center">
              {comic.Cover_Image ? (
                <div className="text-center">
                  <img
                    src={comic.Cover_Image}
                    alt="Cover"
                    className="w-32 h-48 object-cover mx-auto mb-4"
                  />
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/jpeg,image/png"
                    {...register('coverImage', { required: false })}
                    className="border-2 border-black h-12 mt-2"
                  />
                  {errors.coverImage && (
                    <p className="text-destructive text-sm">{errors.coverImage.message as string}</p>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    No image uploaded yet. Drag and drop or click to browse.
                  </p>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/jpeg,image/png"
                    {...register('coverImage', { required: false })}
                    className="border-2 border-black h-12"
                  />
                  {errors.coverImage && (
                    <p className="text-destructive text-sm">{errors.coverImage.message as string}</p>
                  )}
                </>
              )}
              {coverImage && coverImage.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Selected: {coverImage[0].name}</p>
                </div>
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
              disabled={isLoading || isSubmitting}
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
              <Button type="submit" className="comic-button gap-2" disabled={isLoading || isSubmitting}>
                <Save className="h-5 w-5" />
                {isSubmitting || isLoading ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
