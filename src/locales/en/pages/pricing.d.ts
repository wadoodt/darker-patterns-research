declare const _default: {
  hero: {
    title: string;
    description: string;
  };
  plans: {
    business: {
      title: string;
      description: string;
      ctaText: string;
      price?: string;
      interval?: string;
    };
    premium: {
      title: string;
      description: string;
      ctaText: string;
      price?: string;
      interval?: string;
    };
    custom: {
      title: string;
      description: string;
      ctaText: string;
    };
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
};
export default _default;
