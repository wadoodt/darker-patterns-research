
import { CreateArticleModal } from "../CreateArticleModal";
import { EditArticleModal } from "../EditArticleModal";
import type { KnowledgeBaseArticle, ArticleTranslation } from "@api/domains/knowledge-base/types";

type ModalsSectionProps = {
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;
  isEditModalOpen: boolean;
  setEditModalOpen: (isOpen: boolean) => void;
  editingArticle: KnowledgeBaseArticle | null;
  handleCreate: (translations: { [key: string]: ArticleTranslation }) => void;
  handleUpdate: (article: KnowledgeBaseArticle) => void;
};

export function ModalsSection({
  isCreateModalOpen,
  setCreateModalOpen,
  isEditModalOpen,
  setEditModalOpen,
  editingArticle,
  handleCreate,
  handleUpdate,
}: ModalsSectionProps) {
  return (
    <>
      <CreateArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreate}
      />
      <EditArticleModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdate}
        article={editingArticle}
      />
    </>
  );
}
