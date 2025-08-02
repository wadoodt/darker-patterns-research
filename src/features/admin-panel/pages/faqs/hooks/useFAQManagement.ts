import { useEffect, useMemo, useState } from "react";
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from "@api/domains/faq/hooks";
import type { FaqItem } from "@api/domains/faq/types";

export const useFAQManagement = () => {
  const { data, loading: isLoadingFaqs, error } = useFaqs();
  const { mutate: createFaq } = useCreateFaq();
  const { mutate: updateFaq } = useUpdateFaq();
  const { mutate: deleteFaq } = useDeleteFaq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const faqs = useMemo(() => data?.faqs || [], [data]);

  useEffect(() => {
    if (faqs) {
      console.log(faqs);
    }
  }, [faqs]);

  const handleOpenModal = (faq: FaqItem | null = null) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSave = async (faq: FaqItem | Omit<FaqItem, "id">) => {
    if ("id" in faq) {
      updateFaq(faq as FaqItem);
    } else {
      createFaq(faq);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaq(id);
    }
  };

  return {
    faqs,
    isLoading: isLoadingFaqs,
    error,
    isModalOpen,
    editingFaq,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleCreate: handleSave,
    handleUpdate: handleSave,
  };
};
