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
  createdAt: string;
  updatedAt: string;
  [key: string]: string | {
    [key: string]: {
      question: string;
      answer: string;
    };
  } | FaqCategory | undefined;
}

export type FaqsResponse = {
  faqs: FaqItem[];
  page: number;
  totalPages: number;
  totalItems: number;
};

export type CreateFaqPayload = Omit<FaqItem, "id">;

export type UpdateFaqPayload = Partial<CreateFaqPayload>;

export type FaqMutationResponse = {
  faq: FaqItem;
};

export type DeleteFaqResponse = {
  faq: { id: string };
}; 