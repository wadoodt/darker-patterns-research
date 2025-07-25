import { useState } from "react";
import { Table, Badge, Button, Flex, Switch, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { User } from "types/api/user";
import { useAuth } from "contexts/AuthContext";
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

export const TeamMembersTableSection: React.FC<TeamMembersTableSectionProps> = ({ members, loading, error, errorMessage, onUpdateMember, onDeleteMember, onUpdatePlatformRole }) => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const canManageRoles = authUser?.companyRole === 'owner' || authUser?.platformRole === 'admin';

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
            <Table.ColumnHeaderCell>{t("team.actions")}</Table.ColumnHeaderCell>
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
              <Table.Row key={member.id}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>
                  <Badge color="grass">{member.status}</Badge>
                </Table.Cell>
                <Table.Cell>{member.companyRole}</Table.Cell>
                <Table.Cell>
                  <Text as="label" size="2">
                    <Flex gap="2">
                      <Switch
                        checked={member.platformRole === 'admin'}
                        onCheckedChange={(isChecked) => {
                          const newRole = isChecked ? 'admin' : 'user';
                          onUpdatePlatformRole(member.id, newRole);
                        }}
                        disabled={!canManageRoles || member.id === authUser?.id || member.companyRole === 'owner'}
                      />
                      {member.platformRole}
                    </Flex>
                  </Text>
                </Table.Cell>
                <Table.Cell>{member.lastActive}</Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <Button size="1" variant="soft" onClick={() => handleEditClick(member)}>{t("team.edit")}</Button>
                    <Button size="1" variant="soft" color="red" onClick={() => handleDeleteClick(member)}>{t("team.delete")}</Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
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
