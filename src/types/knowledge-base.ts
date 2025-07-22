export interface Translation {
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
    [key: string]: Translation;
  };
  [key: string]: unknown;
}
