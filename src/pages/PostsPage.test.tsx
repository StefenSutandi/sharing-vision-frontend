import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostsPage from './PostsPage';
import * as articlesApi from '../api/articles';

vi.mock('../api/articles', () => ({
  getArticles: vi.fn(),
  trashArticle: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Wrapper = ({ children, initialEntries = ['/posts'] }: { children: React.ReactNode, initialEntries?: string[] }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

describe('PostsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('fetches default Published tab on load', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [{ id: 1, title: 'Title 1', content: 'content', category: 'Tech', status: 'publish', created_date: '', updated_date: '' }],
      pagination: { total: 1, limit: 100, offset: 0 },
    });

    render(<Wrapper><PostsPage /></Wrapper>);

    await waitFor(() => {
      expect(articlesApi.getArticles).toHaveBeenCalledWith(100, 0, 'publish');
    });
    
    expect(await screen.findByText('Title 1')).toBeInTheDocument();
  });

  it('normalizes invalid status to publish', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [],
      pagination: { total: 0, limit: 100, offset: 0 },
    });

    render(<Wrapper initialEntries={['/posts?status=invalid_status']}><PostsPage /></Wrapper>);

    await waitFor(() => {
      expect(articlesApi.getArticles).toHaveBeenCalledWith(100, 0, 'publish');
    });
  });

  it('shows empty state when no articles', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [],
      pagination: { total: 0, limit: 100, offset: 0 },
    });

    render(<Wrapper><PostsPage /></Wrapper>);
    expect(await screen.findByText('No articles found in this tab.')).toBeInTheDocument();
  });

  it('hides trash action on Trashed tab', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [{ id: 1, title: 'Trashed Post', content: 'content', category: 'Tech', status: 'thrash', created_date: '', updated_date: '' }],
      pagination: { total: 1, limit: 100, offset: 0 },
    });

    render(<Wrapper initialEntries={['/posts?status=thrash']}><PostsPage /></Wrapper>);
    
    await screen.findByText('Trashed Post');
    expect(screen.queryByLabelText('Move article to trash')).not.toBeInTheDocument();
  });

  it('confirms trash action before deleting', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [{ id: 1, title: 'Valid Post', content: 'content', category: 'Tech', status: 'publish', created_date: '', updated_date: '' }],
      pagination: { total: 1, limit: 100, offset: 0 },
    });
    vi.mocked(articlesApi.trashArticle).mockResolvedValue();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<Wrapper><PostsPage /></Wrapper>);
    
    const trashBtn = await screen.findByLabelText('Move article to trash');
    fireEvent.click(trashBtn);
    
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to move this article to trash?');
    await waitFor(() => {
      expect(articlesApi.trashArticle).toHaveBeenCalledWith(1);
    });
    confirmSpy.mockRestore();
  });
  
  it('cancels trash action', async () => {
    vi.mocked(articlesApi.getArticles).mockResolvedValue({
      data: [{ id: 1, title: 'Valid Post', content: 'content', category: 'Tech', status: 'publish', created_date: '', updated_date: '' }],
      pagination: { total: 1, limit: 100, offset: 0 },
    });
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<Wrapper><PostsPage /></Wrapper>);
    
    const trashBtn = await screen.findByLabelText('Move article to trash');
    fireEvent.click(trashBtn);
    
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to move this article to trash?');
    expect(articlesApi.trashArticle).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
