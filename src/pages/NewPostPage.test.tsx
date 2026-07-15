import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewPostPage from './NewPostPage';
import * as articlesApi from '../api/articles';

vi.mock('../api/articles', () => ({
  createArticle: vi.fn(),
}));

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('NewPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits publish status', async () => {
    vi.mocked(articlesApi.createArticle).mockResolvedValue({ id: 1, title: 'Valid title with twenty chars', content: 'a'.repeat(200), category: 'Tech', status: 'publish', created_date: '', updated_date: '' });
    
    render(<Wrapper><NewPostPage /></Wrapper>);
    
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Valid title with twenty chars' } });
    fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: 'a'.repeat(200) } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Tech' } });
    
    fireEvent.click(screen.getByText('Publish'));
    
    await waitFor(() => {
      expect(articlesApi.createArticle).toHaveBeenCalledWith({
        title: 'Valid title with twenty chars',
        content: 'a'.repeat(200),
        category: 'Tech',
        status: 'publish',
      });
    });
  });

  it('submits draft status', async () => {
    vi.mocked(articlesApi.createArticle).mockResolvedValue({ id: 1, title: 'Valid title with twenty chars', content: 'a'.repeat(200), category: 'Tech', status: 'draft', created_date: '', updated_date: '' });
    
    render(<Wrapper><NewPostPage /></Wrapper>);
    
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Valid title with twenty chars' } });
    fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: 'a'.repeat(200) } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Tech' } });
    
    fireEvent.click(screen.getByText('Draft'));
    
    await waitFor(() => {
      expect(articlesApi.createArticle).toHaveBeenCalledWith({
        title: 'Valid title with twenty chars',
        content: 'a'.repeat(200),
        category: 'Tech',
        status: 'draft',
      });
    });
  });
});
