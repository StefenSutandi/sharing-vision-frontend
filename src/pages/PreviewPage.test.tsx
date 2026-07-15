import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PreviewPage from './PreviewPage';
import * as articlesApi from '../api/articles';

vi.mock('../api/articles', () => ({
  getArticles: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

describe('PreviewPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('fetches only publish status with limit 5', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [{ id: 1, title: 'Title 1', content: 'content', category: 'Tech', status: 'publish', created_date: '', updated_date: '' }],
      pagination: { total: 10, limit: 5, offset: 0 },
    });

    render(<Wrapper><PreviewPage /></Wrapper>);
    expect(screen.getByText('Loading preview...')).toBeInTheDocument();

    await waitFor(() => {
      expect(articlesApi.getArticles).toHaveBeenCalledWith(5, 0, 'publish');
    });
  });

  it('shows error state when api fails', async () => {
    vi.mocked(articlesApi.getArticles).mockRejectedValue(new Error('Network error'));
    render(<Wrapper><PreviewPage /></Wrapper>);
    expect(await screen.findByText('Failed to load articles.')).toBeInTheDocument();
  });

  it('paginates correctly', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [{ id: 1, title: 'Title 1', content: 'content', category: 'Tech', status: 'publish', created_date: '', updated_date: '' }],
      pagination: { total: 10, limit: 5, offset: 0 },
    });

    render(<Wrapper><PreviewPage /></Wrapper>);
    
    const nextBtn = await screen.findByText('Next');
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(articlesApi.getArticles).toHaveBeenCalledWith(5, 5, 'publish');
    });
  });
});
