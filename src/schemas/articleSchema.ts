import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(20, 'Title must be at least 20 characters').max(200, 'Title must be at most 200 characters'),
  content: z.string().min(200, 'Content must be at least 200 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters').max(100, 'Category must be at most 100 characters'),
  status: z.enum(['publish', 'draft', 'thrash']),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
