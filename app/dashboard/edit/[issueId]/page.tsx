'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ComicIssue } from '@/types/types';
import { IssueFormData, issueSchema } from '@/schema/issueSchema';

// const issueSchema = z.object({
//     issue_number: z.number().int('Issue number must be an integer').min(1, 'Issue number must be at least 1'),
//     title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
//     storage_path: z.string().url('Must be a valid URL').optional(),
// });

// type IssueFormData = z.infer<typeof issueSchema>;

export default function EditIssuePage() {
    const router = useRouter();
    const params = useParams();
    const { issueId } = params as { issueId: string };
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [issue, setIssue] = useState<ComicIssue | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm<IssueFormData>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            issue_number: 1,
            title: '',
            storage_path: '',
        },
    });

    useEffect(() => {
        console.log('Fetching issue with issueId:', issueId); // Log the issueId
        const fetchIssue = async () => {
            setIsLoading(true);
            try {
                const { data, error, count } = await supabase
                    .from('comic_issues') // Explicitly confirm this is comic_issues
                    .select('*', { count: 'exact' })
                    .eq('id', issueId)
                    .single();

                // console.log('Query URL:', supabase.rpcUrl); // Log the base URL to confirm
                console.log('Query result:', { data, error, count }); // Log the result
                if (error && error.code !== 'PGRST116') throw error;
                if (!data) {
                    throw new Error(`No issue found with ID: ${issueId}`);
                }

                setIssue(data);
                reset({
                    issue_number: data.issue_number,
                    title: data.title,
                    storage_path: data.storage_path || '',
                });
            } catch (err) {
                console.error('Fetch error details:', err); // Log full error
                toast({
                    title: 'ERROR',
                    description: err instanceof Error ? err.message : 'Failed to load issue',
                    variant: 'destructive',
                });
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssue();
    }, [issueId, router, toast, reset]);


    const onSubmit = async (data: IssueFormData) => {
        try {
          setIsLoading(true);
    
          const { error } = await supabase
            .from('comic_issues')
            .update({
              issue_number: data.issue_number,
              title: data.title,
              storage_path: data.storage_path,
              updated_at: new Date().toISOString(),
            })
            .eq('id', issueId);
    
          if (error) throw error;
    
          toast({
            title: 'BOOM! ISSUE UPDATED!',
            description: `"${data.title}" has been updated successfully`,
            duration: 5000,
          });
    
          router.push('/dashboard');
        } catch (err) {
          toast({
            title: 'ERROR',
            description: err instanceof Error ? err.message : 'Failed to update issue',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
    
      const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this issue?')) {
          try {
            setIsLoading(true);
    
            if (issue?.storage_path) {
              console.log('Delete storage_path not implemented for Backblaze:', issue.storage_path);
            }
    
            const { error } = await supabase
              .from('comic_issues')
              .delete()
              .eq('id', issueId);
    
            if (error) throw error;
    
            toast({
              title: 'ISSUE DELETED!',
              description: `"${issue?.title}" has been removed`,
              duration: 5000,
            });
    
            router.push('/dashboard');
          } catch (err) {
            toast({
              title: 'ERROR',
              description: err instanceof Error ? err.message : 'Failed to delete issue',
              variant: 'destructive',
            });
          } finally {
            setIsLoading(false);
          }
        }
      };
    
      if (isLoading || !issue) {
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
                    <h1 className="comic-heading text-4xl text-black">EDIT ISSUE</h1>
                    <p className="text-muted-foreground">{issue.title}</p>
                </div>
            </div>

            <Card className="comic-panel p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="issue_number" className="text-lg">
                            Issue Number
                        </Label>
                        <Input
                            id="issue_number"
                            type="number"
                            {...register('issue_number', { valueAsNumber: true })}
                            className="border-2 border-black h-12"
                        />
                        {errors.issue_number && (
                            <p className="text-destructive text-sm">{errors.issue_number.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg">
                            Title
                        </Label>
                        <Input
                            id="title"
                            {...register('title')}
                            className="border-2 border-black h-12"
                        />
                        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storage_path" className="text-lg">
                            Storage Path (URL)
                        </Label>
                        <Input
                            id="storage_path"
                            {...register('storage_path')}
                            className="border-2 border-black h-12"
                        />
                        {errors.storage_path && (
                            <p className="text-destructive text-sm">{errors.storage_path.message}</p>
                        )}
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
    );
}