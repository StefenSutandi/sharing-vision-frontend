import { describe, it, expect } from 'vitest';
import { articleSchema } from './articleSchema';

describe('Article Schema Validation', () => {
  it('validates a correct article', () => {
    const validArticle = {
      title: 'This is a valid title with more than twenty characters',
      content: 'a'.repeat(200),
      category: 'Technology',
      status: 'publish',
    };
    expect(articleSchema.parse(validArticle)).toEqual(validArticle);
  });

  it('fails when title is too short', () => {
    const result = articleSchema.safeParse({
      title: 'short',
      content: 'a'.repeat(200),
      category: 'Technology',
      status: 'publish',
    });
    expect(result.success).toBe(false);
  });

  it('fails when content is too short', () => {
    const result = articleSchema.safeParse({
      title: 'This is a valid title with more than twenty characters',
      content: 'short',
      category: 'Technology',
      status: 'publish',
    });
    expect(result.success).toBe(false);
  });
  
  it('fails when category is invalid', () => {
    const result = articleSchema.safeParse({
      title: 'This is a valid title with more than twenty characters',
      content: 'a'.repeat(200),
      category: 'Te',
      status: 'publish',
    });
    expect(result.success).toBe(false);
  });
});
