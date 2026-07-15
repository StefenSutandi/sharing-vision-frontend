import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './layouts/DashboardLayout';
import PostsPage from './pages/PostsPage';
import EditPostPage from './pages/EditPostPage';
import NewPostPage from './pages/NewPostPage';
import PreviewPage from './pages/PreviewPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route element={<DashboardLayout />}>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/new" element={<NewPostPage />} />
            <Route path="/posts/:id/edit" element={<EditPostPage />} />
            <Route path="/preview" element={<PreviewPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
