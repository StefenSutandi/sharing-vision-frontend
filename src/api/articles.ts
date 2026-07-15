import api from './axios';
import type { Article, ArticlePayload, PaginationResponse } from '../types';

export const getArticles = async (limit: number, offset: number, status?: string): Promise<PaginationResponse<Article>> => {
  const params = status ? { status } : {};
  const response = await api.get(`/article/${limit}/${offset}`, { params });
  return response.data;
};

export const getArticleById = async (id: number): Promise<Article> => {
  const response = await api.get(`/article/${id}`);
  return response.data;
};

export const createArticle = async (payload: ArticlePayload): Promise<Article> => {
  const response = await api.post('/article/', payload);
  return response.data;
};

export const updateArticle = async (id: number, payload: ArticlePayload): Promise<Article> => {
  const response = await api.put(`/article/${id}`, payload);
  return response.data;
};

export const trashArticle = async (id: number): Promise<void> => {
  await api.delete(`/article/${id}`);
};
