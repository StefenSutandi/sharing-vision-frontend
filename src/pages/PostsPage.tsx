import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getArticles, trashArticle } from '../api/articles';
import type { ArticleStatus } from '../types';

export default function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const currentTab = (searchParams.get('status') as ArticleStatus) || 'publish';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['articles', currentTab],
    queryFn: () => getArticles(100, 0, currentTab),
  });

  const trashMutation = useMutation({
    mutationFn: trashArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      alert('Article moved to trash');
    },
  });

  const handleTabChange = (status: ArticleStatus) => {
    setSearchParams({ status });
  };

  const handleTrash = (id: number) => {
    if (confirm('Are you sure you want to move this article to trash?')) {
      trashMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div className="flex space-x-4">
          {(['publish', 'draft', 'thrash'] as ArticleStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 font-medium capitalize rounded-t-lg transition-colors ${
                currentTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'thrash' ? 'Trashed' : tab === 'draft' ? 'Drafts' : 'Published'}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="text-gray-500">Loading articles...</div>}
      {isError && <div className="text-red-500">Error loading articles.</div>}

      {!isLoading && !isError && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No articles found.</td>
                </tr>
              ) : (
                data?.data?.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button
                        onClick={() => navigate(`/posts/${article.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Article"
                      >
                        Edit
                      </button>
                      {currentTab !== 'thrash' && (
                        <button
                          onClick={() => handleTrash(article.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Trash Article"
                          disabled={trashMutation.isPending}
                        >
                          Trash
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
