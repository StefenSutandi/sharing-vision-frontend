import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getArticles, trashArticle } from '../api/articles';
import type { ArticleStatus } from '../types';
import { Edit2, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const validStatuses = ["publish", "draft", "thrash"] as const;

export default function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const rawStatus = searchParams.get('status');
  
  // Normalize status
  useEffect(() => {
    if (!rawStatus || !validStatuses.includes(rawStatus as any)) {
      setSearchParams({ status: 'publish' }, { replace: true });
    }
  }, [rawStatus, setSearchParams]);

  const currentTab = (validStatuses.includes(rawStatus as any) ? rawStatus : 'publish') as ArticleStatus;

  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ['articles', currentTab],
    queryFn: () => getArticles(100, 0, currentTab),
    enabled: validStatuses.includes(currentTab as any),
  });

  const trashMutation = useMutation({
    mutationFn: (id: number) => trashArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Failed to trash article');
    }
  });

  const handleTrash = (id: number) => {
    if (window.confirm('Are you sure you want to move this article to trash?')) {
      trashMutation.mutate(id);
    }
  };

  const tabs = [
    { id: 'publish', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
    { id: 'thrash', label: 'Trashed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Posts</h2>
        <button
          onClick={() => navigate('/posts/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ status: tab.id })}
              className={`${
                currentTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading && <div className="p-4 text-gray-500">Loading...</div>}
        {isError && <div className="p-4 text-red-500">Error loading posts.</div>}
        
        <ul className="divide-y divide-gray-200">
          {articles?.data?.length === 0 ? (
            <li className="p-4 text-gray-500 text-center">No articles found in this tab.</li>
          ) : (
            articles?.data?.map((article) => (
              <li key={article.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Category: {article.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/posts/${article.id}/edit`)}
                    className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label="Edit article"
                    title="Edit article"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  {currentTab !== 'thrash' && (
                    <button
                      type="button"
                      onClick={() => handleTrash(article.id)}
                      disabled={trashMutation.isPending}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50"
                      aria-label="Move article to trash"
                      title="Move article to trash"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
