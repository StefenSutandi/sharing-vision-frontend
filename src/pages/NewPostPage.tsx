import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { articleSchema } from '../schemas/articleSchema';
import type { ArticleFormValues } from '../schemas/articleSchema';
import { createArticle } from '../api/articles';
import type { ArticleStatus, ArticlePayload } from '../types';

export default function NewPostPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      status: 'publish',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ArticlePayload) => createArticle(data),
    onSuccess: (data) => {
      alert('Article created successfully');
      navigate(`/posts?status=${data.status}`);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Failed to create article');
    }
  });

  const onSubmit = (status: ArticleStatus) => (data: ArticleFormValues) => {
    mutation.mutate({ ...data, status });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Article</h2>
      
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
