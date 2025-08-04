import { db } from "../db";
import { createPagedResponse } from "../utils/paged-response";
import { createSuccessResponse, createErrorResponse } from "../../response";

export const getArticles = async (request: Request) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  return createPagedResponse({
    table: "knowledgeBaseArticle",
    page,
    limit,
    domain: "articles",
  });
};

export const createArticle = async (request: Request): Promise<Response> => {
  const body = await request.json();
  const newArticle = db.knowledgeBaseArticle.create({
    ...body,
    id: `kb-${Math.floor(Math.random() * 100000)}`,
    title: body.translations.en.title,
    description: body.translations.en.description,
    category: body.translations.en.category,
    url: "",
  });
  return createSuccessResponse("OPERATION_SUCCESS", "article", newArticle);
};

export const updateArticle = async (
  request: Request,
  { id }: { id: string },
): Promise<Response> => {
  const body = await request.json();
  const updatedArticle = db.knowledgeBaseArticle.update({
    where: {
      id: id,
    },
    data: {
      ...body,
      title: body.translations.en.title,
      description: body.translations.en.description,
      category: body.translations.en.category,
    },
  });

  if (!updatedArticle) {
    return createErrorResponse("NOT_FOUND", "Article not found");
  }

  return createSuccessResponse("OPERATION_SUCCESS", "article", updatedArticle);
};

export const deleteArticle = async ({
  id,
}: {
  id: string;
}): Promise<Response> => {
  const deletedArticle = db.knowledgeBaseArticle.delete({
    where: {
      id: id,
    },
  });

  if (!deletedArticle) {
    return createErrorResponse("NOT_FOUND", "Article not found");
  }

  return createSuccessResponse("OPERATION_SUCCESS", "article", null);
};
