import React from 'react';
import { Box, Flex, Heading, IconButton, DropdownMenu, Button, Table } from '@radix-ui/themes';
import type { KnowledgeBaseArticle } from '../../../types/knowledge-base';
import { MoreHorizontal, PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CreateArticleModal } from '../components/CreateArticleModal';
import { EditArticleModal } from '../components/EditArticleModal';
import { useArticleManagement } from '../hooks/useArticleManagement';
import { getLanguage } from '../../../locales/i18n';

const ArticlesPage: React.FC = () => {
    const { t } = useTranslation();
    const {
        articles,
        isLoading,
        error,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = useArticleManagement();

    const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
    const [isEditModalOpen, setEditModalOpen] = React.useState(false);
    const [editingArticle, setEditingArticle] = React.useState<KnowledgeBaseArticle | null>(null);

    const handleEditClick = (article: KnowledgeBaseArticle) => {
        setEditingArticle(article);
        setEditModalOpen(true);
    };

    if (error) return <Box>{t('articlesPage.errorLoading')}</Box>;

    return (
        <Box>
            <Flex justify="between" align="center" mb="6">
                <Heading as="h1">{t('articlesPage.manageArticles')}</Heading>
                <Button onClick={() => setCreateModalOpen(true)}>
                    <PlusIcon size={16} style={{ marginRight: '4px' }} />
                    {t('articlesPage.createArticle')}
                </Button>
            </Flex>

            {isLoading && <p>Loading articles...</p>}

            {!isLoading && articles && (
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>{t('articlesPage.title')}</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>{t('articlesPage.category')}</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {articles.map(article => {
                            const lang = getLanguage();
                            const translation = article.translations[lang] || article.translations.en;
                            return (
                                <Table.Row key={article.id}>
                                    <Table.Cell>{translation.title}</Table.Cell>
                                    <Table.Cell>{translation.category}</Table.Cell>
                                    <Table.Cell>
                                        <Flex justify="end">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger>
                                                    <IconButton variant="ghost">
                                                        <MoreHorizontal size={16} />
                                                    </IconButton>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item onClick={() => handleEditClick(article)}>
                                                        <PencilIcon size={14} style={{ marginRight: '8px' }} />
                                                        {t('articlesPage.edit')}
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Separator />
                                                    <DropdownMenu.Item color="red" onClick={() => handleDelete(article.id)}>
                                                        <TrashIcon size={14} style={{ marginRight: '8px' }} />
                                                        {t('articlesPage.delete')}
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table.Root>
            )}

            <CreateArticleModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSave={handleCreate}
            />

            {editingArticle && (
                <EditArticleModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    article={editingArticle}
                    onSave={handleUpdate}
                />
            )}
        </Box>
    );
};

export default ArticlesPage;
