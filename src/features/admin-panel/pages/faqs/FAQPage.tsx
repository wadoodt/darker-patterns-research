import { Box } from "@radix-ui/themes";
import { HeaderSection } from "@features/admin-panel/pages/faqs/sections/HeaderSection";
import { FAQTableSection } from "@features/admin-panel/pages/faqs/sections/FAQTableSection";
import { ModalsSection } from "@features/admin-panel/pages/faqs/sections/ModalsSection";
import { useFAQManagement } from "@features/admin-panel/pages/faqs/hooks/useFAQManagement";
import { useState } from "react";
import type { FaqItem } from "@api/domains/faq/types";

export default function FAQPage() {
  const { faqs = [], isLoading, error, handleCreate, handleUpdate, handleDelete } = useFAQManagement();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FaqItem | null>(null);

const handleEdit = async (faq: FaqItem) => {
    setEditingFAQ(faq);
    setEditModalOpen(true);
  };

  if (error) return <Box>Error loading FAQs</Box>;

  return (
    <Box>
      <HeaderSection onCreate={() => setCreateModalOpen(true)} />
      <FAQTableSection 
        faqs={faqs || []} 
        isLoading={isLoading}
        onUpdate={handleEdit}
        onDelete={handleDelete} 
      />
      <ModalsSection 
        isCreateModalOpen={isCreateModalOpen} 
        setCreateModalOpen={setCreateModalOpen} 
        isEditModalOpen={isEditModalOpen} 
        setEditModalOpen={setEditModalOpen} 
        editingFAQ={editingFAQ}
        handleCreate={handleCreate} 
        handleUpdate={handleUpdate}
      />
    </Box>
  );
}
