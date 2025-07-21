import React, { useState } from 'react';
import { Box, Button, Dialog, Flex, Tabs, TextArea, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import type { Translation } from '../../../types/knowledge-base';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (translations: { [key: string]: Translation }) => Promise<void>;
}

const initialFormState = {
    en: { title: '', category: '', description: '', body: '' },
    es: { title: '', category: '', description: '', body: '' },
};

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const [form, setForm] = useState(initialFormState);
    const [activeLang, setActiveLang] = useState<'en' | 'es'>('en');
    const [saving, setSaving] = useState(false);

    const handleFieldChange = (lang: 'en' | 'es', field: keyof Translation, value: string) => {
        setForm(prev => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(form);
            setForm(initialFormState);
            onClose();
        } catch (err) {
            console.error(err); // TODO: show error to user
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content style={{ maxWidth: 600 }}>
                <Dialog.Title>{t('articlesPage.createArticle')}</Dialog.Title>
                <form onSubmit={handleSubmit}>
                    <Tabs.Root value={activeLang} onValueChange={v => setActiveLang(v as 'en' | 'es')}>
                        <Tabs.List>
                            <Tabs.Trigger value="en">English</Tabs.Trigger>
                            <Tabs.Trigger value="es">Spanish</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="en">
                            <Box my="4">
                                <TextField.Root placeholder="Title" value={form.en.title} onChange={e => handleFieldChange('en', 'title', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Category" value={form.en.category} onChange={e => handleFieldChange('en', 'category', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Description" value={form.en.description} onChange={e => handleFieldChange('en', 'description', e.target.value)} mb="2" />
                                <TextArea placeholder="Body" value={form.en.body} onChange={e => handleFieldChange('en', 'body', e.target.value)} rows={6} />
                            </Box>
                        </Tabs.Content>
                        <Tabs.Content value="es">
                            <Box my="4">
                                <TextField.Root placeholder="Título" value={form.es.title} onChange={e => handleFieldChange('es', 'title', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Categoría" value={form.es.category} onChange={e => handleFieldChange('es', 'category', e.target.value)} mb="2" />
                                <TextField.Root placeholder="Descripción" value={form.es.description} onChange={e => handleFieldChange('es', 'description', e.target.value)} mb="2" />
                                <TextArea placeholder="Cuerpo" value={form.es.body} onChange={e => handleFieldChange('es', 'body', e.target.value)} rows={6} />
                            </Box>
                        </Tabs.Content>
                    </Tabs.Root>
                    <Flex mt="4" gap="3" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" type="button" onClick={onClose}>Cancel</Button>
                        </Dialog.Close>
                        <Button type="submit" loading={saving} disabled={saving}>Save</Button>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};
