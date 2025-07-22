import { useAsyncCache } from '@hooks/useAsyncCache';
import type { KnowledgeBaseArticle, Translation } from '../../../types/knowledge-base';
import { useTranslation } from 'react-i18next';
import api from '../../../api/client';
import { CacheLevel } from '../../../lib/cache/types';

export const useArticleManagement = () => {
    const { t } = useTranslation();
    const { data: articles, loading: isLoading, error, refresh: mutate } = useAsyncCache<KnowledgeBaseArticle[]>(
        ['admin-articles'],
        async () => {
            const response = await api.get<KnowledgeBaseArticle[]>('/articles');
            return response.data;
        },
        CacheLevel.SESSION
    );

    const handleCreate = async (translations: { [key: string]: Translation }) => {
        try {
            await api.post('/articles', { translations });
            await mutate();
        } catch (err) {
            console.error(err);
            throw err; // Re-throw to allow modal to handle error state
        }
    };

    const handleUpdate = async (article: KnowledgeBaseArticle) => {
        try {
            await api.put(`/articles/${article.id}`, article);
            await mutate();
        } catch (err) {
            console.error(err);
            throw err; // Re-throw to allow modal to handle error state
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('articlesPage.deleteConfirmation')))
            return;

        try {
            await api.delete(`/articles/${id}`);
            await mutate();
        } catch (err) {
            console.error(err);
            // TODO: show error to user
        }
    };

    return {
        articles,
        isLoading,
        error,
        handleCreate,
        handleUpdate,
        handleDelete,
    };
};
