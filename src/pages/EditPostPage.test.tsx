import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditPostPage from './EditPostPage';
import * as articlesApi from '../api/articles';

vi.mock('../api/articles', () => ({
  getArticleById: vi.fn(),
  updateArticle: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={['/posts/1/edit']}>
      <Routes>
        <Route path="/posts/:id/edit" element={children} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('EditPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('loads initial form values', async () => {
    vi.mocked(articlesApi.getArticleById).mockResolvedValue({
      id: 1, title: 'Loaded Title', content: 'a'.repeat(200), category: 'Tech', status: 'draft', created_date: '', updated_date: ''
    });

    render(<Wrapper><EditPostPage /></Wrapper>);

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
      expect(titleInput.value).toBe('Loaded Title');
    });
  });

  it('submits updated publish', async () => {
    vi.mocked(articlesApi.getArticleById).mockResolvedValue({
      id: 1, title: 'Loaded Title', content: 'a'.repeat(200), category: 'Tech', status: 'draft', created_date: '', updated_date: ''
    });
    vi.mocked(articlesApi.updateArticle).mockResolvedValue({
      id: 1, title: 'Updated Title', content: 'a'.repeat(200), category: 'Tech', status: 'publish', created_date: '', updated_date: ''
    });

    render(<Wrapper><EditPostPage /></Wrapper>);

    await waitFor(() => {
      expect(screen.getByLabelText(/Title/i)).toHaveValue('Loaded Title');
    });

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Title with twenty chars' } });
    fireEvent.click(screen.getByText('Publish'));

    await waitFor(() => {
      expect(articlesApi.updateArticle).toHaveBeenCalledWith(1, expect.objectContaining({
        title: 'Updated Title with twenty chars',
        status: 'publish',
      }));
    });
  });
});
