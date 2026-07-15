import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleSchema } from '../schemas/articleSchema';
import type { ArticleFormValues } from '../schemas/articleSchema';
import { getArticleById, updateArticle } from '../api/articles';
import type { ArticleStatus } from '../types';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(Number(id)),
    enabled: !!id,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
  });

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        content: article.content,
        category: article.category,
        status: article.status,
      });
    }
  }, [article, reset]);

  const mutation = useMutation({
    mutationFn: (payload: { id: number; data: ArticleFormValues & { status: ArticleStatus } }) =>
      updateArticle(payload.id, payload.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      alert('Article updated successfully');
      navigate(`/posts?status=${data.status}`);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Failed to update article');
    }
  });

  const onSubmit = (status: ArticleStatus) => (data: ArticleFormValues) => {
    mutation.mutate({ id: Number(id), data: { ...data, status } });
  };

  if (isLoading) return <div className="p-6">Loading article...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading article (may be 404).</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Article</h2>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            {...register('content')}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            id="category"
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={handleSubmit(onSubmit('publish'))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Publish
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={handleSubmit(onSubmit('draft'))}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Draft
          </button>
        </div>
      </form>
    </div>
  );
}
