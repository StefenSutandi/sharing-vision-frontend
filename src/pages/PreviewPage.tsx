import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '../api/articles';

export default function PreviewPage() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['articles', 'publish', limit, offset],
    queryFn: () => getArticles(limit, offset, 'publish'),
  });

  const totalPages = data ? Math.ceil(data.pagination.total / limit) : 0;

  if (isLoading) return <div className="p-6 text-gray-500">Loading preview...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load articles.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <h2 className="text-3xl font-bold border-b pb-4">Published Articles</h2>
      
      <div className="space-y-8">
        {data?.data?.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No published articles available.</p>
        ) : (
          data?.data?.map((article) => (
            <article key={article.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">{article.title}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {article.category}
                </span>
              </div>
              {article.created_date && (
                <div className="text-sm text-gray-500 mb-4">
                  Published on: {new Date(article.created_date).toLocaleDateString()}
                </div>
              )}
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{article.content}</p>
              </div>
            </article>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 pt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
