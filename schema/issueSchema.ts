import * as z from 'zod';

export const issueSchema = z.object({
  issue_number: z
    .number()
    .int('Issue number must be an integer')
    .min(1, 'Issue number must be at least 1'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  storage_path: z
    .string()
    .url('Storage path must be a valid URL')
    .min(1, 'Storage path is required'),
});

export type IssueFormData = z.infer<typeof issueSchema>;