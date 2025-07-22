import React from "react";
import { CreateArticleModal } from "../CreateArticleModal";
import { EditArticleModal } from "../EditArticleModal";
import type { KnowledgeBaseArticle, Translation } from "types/knowledge-base";

interface ModalsSectionProps {
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  editingArticle: KnowledgeBaseArticle | null;
  handleCreate: (translations: { [key: string]: Translation }) => Promise<void>;
  handleUpdate: (article: KnowledgeBaseArticle) => Promise<void>;
}

export const ModalsSection: React.FC<ModalsSectionProps> = ({
  isCreateModalOpen,
  setCreateModalOpen,
  isEditModalOpen,
  setEditModalOpen,
  editingArticle,
  handleCreate,
  handleUpdate,
}) => (
  <>
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
  </>
);
