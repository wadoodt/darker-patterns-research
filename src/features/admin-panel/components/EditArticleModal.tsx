import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, Flex, Tabs, TextArea, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import type { KnowledgeBaseArticle, Translation } from '../../../types/knowledge-base';

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: KnowledgeBaseArticle | null;
  onSave: (article: KnowledgeBaseArticle) => Promise<void>;
}

export const EditArticleModal: React.FC<EditArticleModalProps> = ({ isOpen, onClose, article, onSave }) => {
    const { t } = useTranslation();
    const [editingArticle, setEditingArticle] = useState<KnowledgeBaseArticle | null>(article);
    const [activeLang, setActiveLang] = useState<'en' | 'es'>('en');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setEditingArticle(article);
    }, [article]);

    const handleFieldChange = (lang: 'en' | 'es', field: keyof Translation, value: string) => {
        setEditingArticle(prev => {
            if (!prev) return null;
            const updatedArticle = { ...prev };
            updatedArticle.translations[lang][field] = value;
            // Also update the top-level fields if editing the default language (e.g., 'en')
            if (lang === 'en') {
                if (field === 'title') updatedArticle.title = value;
                else if (field === 'description') updatedArticle.description = value;
                else if (field === 'category') updatedArticle.category = value;
            }
            return updatedArticle;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingArticle) return;
        setSaving(true);
        try {
            await onSave(editingArticle);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (!editingArticle) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content style={{ maxWidth: 600 }}>
                <Dialog.Title>{t('articlesPage.editArticle')}</Dialog.Title>
                <form onSubmit={handleSubmit}>
                    <Tabs.Root value={activeLang} onValueChange={v => setActiveLang(v as 'en' | 'es')}>
                        <Tabs.List>
                            <Tabs.Trigger value="en">English</Tabs.Trigger>
                            <Tabs.Trigger value="es">Spanish</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="en">
                            <Box my="4">
                                <TextField.Root placeholder="Title" value={editingArticle.translations.en.title} onChange={e => handleFieldChange('en', 'title', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Category" value={editingArticle.translations.en.category} onChange={e => handleFieldChange('en', 'category', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Description" value={editingArticle.translations.en.description} onChange={e => handleFieldChange('en', 'description', e.target.value)} mb="2" />
                                <TextArea placeholder="Body" value={editingArticle.translations.en.body} onChange={e => handleFieldChange('en', 'body', e.target.value)} rows={6} />
                            </Box>
                        </Tabs.Content>
                        <Tabs.Content value="es">
                            <Box my="4">
                                <TextField.Root placeholder="Título" value={editingArticle.translations.es.title} onChange={e => handleFieldChange('es', 'title', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Categoría" value={editingArticle.translations.es.category} onChange={e => handleFieldChange('es', 'category', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Descripción" value={editingArticle.translations.es.description} onChange={e => handleFieldChange('es', 'description', e.target.value)} mb="2" />
                                <TextArea placeholder="Cuerpo" value={editingArticle.translations.es.body} onChange={e => handleFieldChange('es', 'body', e.target.value)} rows={6} />
                            </Box>
                        </Tabs.Content>
                    </Tabs.Root>
                    <Flex mt="4" gap="3" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" type="button" onClick={onClose}>Cancel</Button>
                        </Dialog.Close>
                        <Button type="submit" loading={saving} disabled={saving}>Save Changes</Button>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};
