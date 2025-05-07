import { z } from 'zod';

export const bookSchema = z.object({
  name: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  price: z
    .number()
    .min(0, 'Price must be a positive number')
    .optional(),
  index: z
    .number()
    .int('Index must be an integer')
    .min(0, 'Index cannot be negative')
    .optional()
    .transform((val) => (Number.isInteger(val) ? val : undefined)),
  category: z.enum(['comic_issue', 'graphic_novel'], {
    required_error: 'Category is required',
    invalid_type_error: 'Category must be "comic_issue" or "graphic_novel"',
  }),
  coverImage: z
    .any() // Temporarily accept any type to bypass strict type checking
    .optional()
    .refine(
      (files: FileList | undefined) => {
        if (!files || files.length === 0) return true; // Allow empty (optional)
        return files.length === 1; // Ensure only one file is selected
      },
      'Please select only one file'
    )
    .refine(
      (files: FileList | undefined) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return file.size <= 5 * 1024 * 1024;
      },
      'File size must be less than 5MB'
    )
    .refine(
      (files: FileList | undefined) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return ['image/jpeg', 'image/png'].includes(file.type);
      },
      'Only JPEG or PNG files are allowed'
    ),
});

export type BookFormData = z.infer<typeof bookSchema>;