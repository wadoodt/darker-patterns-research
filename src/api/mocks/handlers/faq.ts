import { mockFaqs } from "../data/faqs";

export const getFaqs = (request: Request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  let faqs = mockFaqs;

  if (category) {
    faqs = faqs.filter((faq) => faq.category === category);
  }

  const response = {
    data: faqs,
    currentPage: page,
    totalPages: Math.ceil(faqs.length / limit),
    total: faqs.length,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
