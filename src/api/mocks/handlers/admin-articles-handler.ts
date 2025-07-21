import { mockSupportArticles } from '../_data/support';

import type { KnowledgeBaseArticle } from '../../../types/knowledge-base';

const articles: KnowledgeBaseArticle[] = [...mockSupportArticles];

export const getArticles = async (): Promise<Response> => {
    return new Response(JSON.stringify(articles), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const createArticle = async (request: Request): Promise<Response> => {
    const body = await request.json();
    const newId = `kb-${Math.floor(Math.random() * 100000)}`;
    const newArticle = {
        id: newId,
        title: body.translations.en.title,
        description: body.translations.en.description,
        category: body.translations.en.category,
        url: '',
        translations: body.translations,
    };
    articles.unshift(newArticle);
    return new Response(JSON.stringify(newArticle), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const updateArticle = async (request: Request, { id }: { id: string }): Promise<Response> => {
    const body = await request.json();
    const articleIndex = articles.findIndex(a => a.id === id);

    if (articleIndex === -1) {
        return new Response('Article not found', { status: 404 });
    }

    const updatedArticle = {
        ...articles[articleIndex],
        ...body,
        title: body.translations.en.title,
        description: body.translations.en.description,
        category: body.translations.en.category,
    };

    articles[articleIndex] = updatedArticle;

    return new Response(JSON.stringify(updatedArticle), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const deleteArticle = async ({ id }: { id: string }): Promise<Response> => {
    const articleIndex = articles.findIndex(a => a.id === id);

    if (articleIndex === -1) {
        return new Response('Article not found', { status: 404 });
    }

    articles.splice(articleIndex, 1);

    return new Response(null, { status: 204 });
};
