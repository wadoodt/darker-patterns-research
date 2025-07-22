import { useState } from "react";
import type { Translation } from "types/knowledge-base";

const initialFormState = {
  en: { title: "", category: "", description: "", body: "" },
  es: { title: "", category: "", description: "", body: "" },
};

export function useCreateArticleModal(onSave: (translations: { [key: string]: Translation }) => Promise<void>, onClose: () => void) {
  const [form, setForm] = useState(initialFormState);
  const [activeLang, setActiveLang] = useState<"en" | "es">("en");
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (
    lang: "en" | "es",
    field: keyof Translation,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
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

  return {
    form,
    setForm,
    activeLang,
    setActiveLang,
    saving,
    handleFieldChange,
    handleSubmit,
  };
} 