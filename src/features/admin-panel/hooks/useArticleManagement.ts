import { useAsyncCache } from '@hooks/useAsyncCache';
import type { KnowledgeBaseArticle, Translation } from '../../../types/knowledge-base';
import { useTranslation } from 'react-i18next';

export const useArticleManagement = () => {
    const { t } = useTranslation();
    const { data: articles, loading: isLoading, error, refresh: mutate } = useAsyncCache<KnowledgeBaseArticle[]>(
        ['admin-articles'],
        () => fetch('/api/admin/articles').then(res => res.json()),
    );

    const handleCreate = async (translations: { [key: string]: Translation }) => {
        try {
            const response = await fetch('/api/admin/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ translations }),
            });
            if (!response.ok) throw new Error('Failed to create article');
            await mutate();
        } catch (err) {
            console.error(err);
            throw err; // Re-throw to allow modal to handle error state
        }
    };

    const handleUpdate = async (article: KnowledgeBaseArticle) => {
        try {
            const response = await fetch(`/api/admin/articles/${article.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(article),
            });
            if (!response.ok) throw new Error('Failed to update article');
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
            const response = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete article');
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
