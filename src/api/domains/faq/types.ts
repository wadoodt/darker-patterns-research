
export type FaqCategory = "home" | "pricing" | "general" | "all";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  translations: {
    [key: string]: {
      question: string;
      answer: string;
    };
  };
  [key: string]: unknown;
} 