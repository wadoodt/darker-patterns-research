import { mockFaqs } from "../data/faqs";
import { createPaginatedResponse } from "../../response";

export const getFaqs = (request: Request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  let faqs = mockFaqs;

  if (category) {
    faqs = faqs.filter((faq) => faq.category === category);
  }

  const total = faqs.length;
  const totalPages = Math.ceil(total / limit);
  const pagedFaqs = faqs.slice((page - 1) * limit, page * limit);

  return createPaginatedResponse(
    "OPERATION_SUCCESS",
    "faqs",
    pagedFaqs,
    page,
    totalPages,
    total
  );
};
