export interface FAQItem {
  id: string;
  category: string;
  translations: {
    [key: string]: {
      question: string;
      answer: string;
    };
  };
  [key: string]: unknown;
}
