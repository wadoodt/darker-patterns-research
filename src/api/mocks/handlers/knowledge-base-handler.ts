import { db } from '../db';

export const getArticles = async () => {
  const articles = db.knowledgeBaseArticle.findMany({});

  return new Response(JSON.stringify(articles), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
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
    url: '',
  });

  return new Response(JSON.stringify(newArticle), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const updateArticle = async (
  request: Request,
  { id }: { id: string }
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
    return new Response('Article not found', { status: 404 });
  }

  return new Response(JSON.stringify(updatedArticle), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const deleteArticle = async ({ id }: { id: string }): Promise<Response> => {
  const deletedArticle = db.knowledgeBaseArticle.delete({
    where: {
      id: id,
    },
  });

  if (!deletedArticle) {
    return new Response('Article not found', { status: 404 });
  }

  return new Response(null, { status: 204 });
};
