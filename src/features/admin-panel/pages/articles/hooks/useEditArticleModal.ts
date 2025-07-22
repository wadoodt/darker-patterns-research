import { useState, useEffect } from "react";
import type { KnowledgeBaseArticle, Translation } from "types/knowledge-base";

export function useEditArticleModal(
  article: KnowledgeBaseArticle | null,
  onSave: (article: KnowledgeBaseArticle) => Promise<void>,
  onClose: () => void,
) {
  const [editingArticle, setEditingArticle] =
    useState<KnowledgeBaseArticle | null>(article);
  const [activeLang, setActiveLang] = useState<"en" | "es">("en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditingArticle(article);
  }, [article]);

  const handleFieldChange = (
    lang: "en" | "es",
    field: keyof Translation,
    value: string,
  ) => {
    setEditingArticle((prev) => {
      if (!prev) return null;
      const updatedArticle = { ...prev };
      updatedArticle.translations[lang][field] = value;
      if (lang === "en") {
        if (field === "title") updatedArticle.title = value;
        else if (field === "description") updatedArticle.description = value;
        else if (field === "category") updatedArticle.category = value;
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

  return {
    editingArticle,
    activeLang,
    setActiveLang,
    saving,
    handleFieldChange,
    handleSubmit,
  };
}
