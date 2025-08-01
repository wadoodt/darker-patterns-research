
export interface ArticleTranslation {
  title: string;
  description: string;
  category: string;
  body: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  translations: {
    [key: string]: ArticleTranslation;
  };
  [key: string]: unknown;
}
