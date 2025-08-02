import { db } from "../db";
import { createPaginatedResponse } from "../../response";
import type { FaqCategory } from "@api/domains/faq/types";

export const getFaqs = (request: Request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") as FaqCategory;
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  // Only apply category filter if specified and not 'all'
  const filter = category && category !== 'all' ? { category } : {};

  const allFaqs = db.faqs.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
  });

  const total = allFaqs.length;
  const totalPages = Math.ceil(total / limit);
  const pagedFaqs = allFaqs.slice((page - 1) * limit, page * limit);

  return createPaginatedResponse(
    "OPERATION_SUCCESS",
    "faqs",
    pagedFaqs,
    page,
    totalPages,
    total
  );
};

export const createFaq = async (request: Request): Promise<Response> => {
  const newFaq = await request.json();
  const createdFaq = db.faqs.create(newFaq);
  return new Response(JSON.stringify(createdFaq), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const updateFaq = async (request: Request, params: Record<string, string>): Promise<Response> => {
  const { id } = params;
  const updatedFaq = await request.json();
  
  try {
    const result = db.faqs.update({
      where: { id },
      data: updatedFaq,
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'FAQ not found' }), { status: 404 });
  }
};

export const deleteFaq = async (params: Record<string, string>): Promise<Response> => {
  const { id } = params;
  
  try {
    db.faqs.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return new Response(JSON.stringify({ error: 'FAQ not found' }), { status: 404 });
  }
};
