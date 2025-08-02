import { Dialog, Button, Flex, TextField, TextArea, Tabs } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import type { FaqItem, FaqCategory } from "@api/domains/faq/types";

interface ModalsSectionProps {
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  editingFAQ: FaqItem | null;
  handleCreate: (data: { category: string; translations: { [key: string]: { question: string; answer: string; }; }; }) => Promise<void>;
  handleUpdate: (faq: FaqItem) => Promise<void>;
}

type FAQFormState = {
  en: { question: string; answer: string };
  es: { question: string; answer: string };
  category: string;
};

const FAQForm = ({
  form,
  setForm,
  activeLang,
  setActiveLang,
  handleSubmit,
  closeModal,
  isEditing,
}: {
  form: FAQFormState;
  setForm: (form: FAQFormState) => void;
  activeLang: 'en' | 'es';
  setActiveLang: (lang: 'en' | 'es') => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  closeModal: () => void;
  isEditing: boolean;
}) => (
  <form onSubmit={handleSubmit}>
    <Flex direction="column" gap="3">
      <TextField.Root
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <Tabs.Root
        value={activeLang}
        onValueChange={(v) => setActiveLang(v as 'en' | 'es')}
      >
        <Tabs.List>
          <Tabs.Trigger value="en">English</Tabs.Trigger>
          <Tabs.Trigger value="es">Spanish</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="en">
          <Flex direction="column" gap="3">
            <TextField.Root
              placeholder="Question (English)"
              value={form.en.question}
              onChange={(e) =>
                setForm({ ...form, en: { ...form.en, question: e.target.value } })
              }
            />
            <TextArea
              placeholder="Answer (English)"
              value={form.en.answer}
              onChange={(e) =>
                setForm({ ...form, en: { ...form.en, answer: e.target.value } })
              }
            />
          </Flex>
        </Tabs.Content>
        <Tabs.Content value="es">
          <Flex direction="column" gap="3">
            <TextField.Root
              placeholder="Question (Spanish)"
              value={form.es.question}
              onChange={(e) =>
                setForm({ ...form, es: { ...form.es, question: e.target.value } })
              }
            />
            <TextArea
              placeholder="Answer (Spanish)"
              value={form.es.answer}
              onChange={(e) =>
                setForm({ ...form, es: { ...form.es, answer: e.target.value } })
              }
            />
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
      <Flex gap="3" justify="end">
        <Button variant="soft" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? 'Save' : 'Create'}</Button>
      </Flex>
    </Flex>
  </form>
);

export const ModalsSection = ({
  isCreateModalOpen,
  setCreateModalOpen,
  isEditModalOpen,
  setEditModalOpen,
  editingFAQ,
  handleCreate,
  handleUpdate,
}: ModalsSectionProps) => {
  const [activeLang, setActiveLang] = useState<'en' | 'es'>('en');
  const [form, setForm] = useState<FAQFormState>({
    en: { question: '', answer: '' },
    es: { question: '', answer: '' },
    category: 'pricing',
  });

  useEffect(() => {
    if (isEditModalOpen && editingFAQ) {
      setForm({
        en: { ...editingFAQ.translations.en },
        es: { ...editingFAQ.translations.es },
        category: editingFAQ.category,
      });
    } else {
      setForm({
        en: { question: '', answer: '' },
        es: { question: '', answer: '' },
        category: 'pricing',
      });
    }
  }, [isEditModalOpen, editingFAQ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      await handleUpdate({
        ...editingFAQ,
        translations: {
          en: { question: form.en.question, answer: form.en.answer },
          es: { question: form.es.question, answer: form.es.answer },
        },
        category: form.category as FaqCategory,
      });
      setEditModalOpen(false);
    } else {
      const { category, en, es } = form;
      await handleCreate({ category, translations: { en, es } });
      setCreateModalOpen(false);
    }
  };

  return (
    <>
      <Dialog.Root open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
        <Dialog.Content>
          <Dialog.Title>Create FAQ</Dialog.Title>
          <Dialog.Description>
            Fill in the form below to create a new FAQ.
          </Dialog.Description>
          <FAQForm
            form={form}
            setForm={setForm}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            handleSubmit={handleSubmit}
            closeModal={() => setCreateModalOpen(false)}
            isEditing={false}
          />
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <Dialog.Content>
          <Dialog.Title>Edit FAQ</Dialog.Title>
          <Dialog.Description>
            Fill in the form below to edit the FAQ.
          </Dialog.Description>
          <FAQForm
            form={form}
            setForm={setForm}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            handleSubmit={handleSubmit}
            closeModal={() => setEditModalOpen(false)}
            isEditing={true}
          />
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
