import { useState } from "react";
import { Table } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { User } from "types/api/user";
import { useAuth } from "contexts/AuthContext";
import { TeamMemberRow } from "./TeamMemberRow";
import EditMemberModal from "../modals/EditMemberModal";
import DeleteMemberModal from "../modals/DeleteMemberModal";

interface TeamMembersTableSectionProps {
  members: User[];
  loading: boolean;
  error: boolean;
  errorMessage: string | null;
  onUpdateMember: (member: User) => void;
  onDeleteMember: (memberId: string) => void;
  onUpdatePlatformRole: (memberId: string, platformRole: "admin" | "user") => void;
}

export const TeamMembersTableSection: React.FC<TeamMembersTableSectionProps> = ({
  members,
  loading,
  error,
  errorMessage,
  onUpdateMember,
  onDeleteMember,
  onUpdatePlatformRole,
}) => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const canManageRoles = authUser?.companyRole === 'owner' || authUser?.platformRole === 'admin';
  const canEdit = authUser?.companyRole !== 'employee';
  const canDelete = authUser?.companyRole !== 'manager';

  const handleEditClick = (member: User) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (member: User) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedMember(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedMember) {
      onDeleteMember(selectedMember.id);
    }
    handleModalClose();
  };

  return (
    <>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t("team.member")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("team.status")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("team.role")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("team.platform_role")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("team.last_active")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("team.actions.table_header")}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={5}>{t("team.loading")}</Table.Cell>
            </Table.Row>
          ) : error ? (
            <Table.Row>
              <Table.Cell colSpan={5}>{errorMessage}</Table.Cell>
            </Table.Row>
          ) : (
            members.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                canEdit={canEdit}
                canDelete={canDelete}
                canManageRoles={canManageRoles}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onUpdatePlatformRole={onUpdatePlatformRole}
              />
            ))
          )}
        </Table.Body>
      </Table.Root>
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        member={selectedMember}
        onSave={onUpdateMember}
      />
      <DeleteMemberModal 
        isOpen={isDeleteModalOpen} 
        onClose={handleModalClose} 
        onConfirm={handleDeleteConfirm} 
        memberName={selectedMember?.name || ''} 
      />
    </>
  );
};
