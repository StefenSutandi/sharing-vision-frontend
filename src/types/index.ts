export type ArticleStatus = 'publish' | 'draft' | 'thrash';

export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
  created_date: string;
  updated_date: string;
}

export interface ArticlePayload {
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}
