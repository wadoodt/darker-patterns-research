import { useState } from "react";
import { Table, Badge, Button, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { TeamMember } from "types/api/team";
import EditMemberModal from "../modals/EditMemberModal";

interface TeamMembersTableSectionProps {
  members: TeamMember[];
  loading: boolean;
  error: boolean;
  errorMessage: string | null;
  onUpdateMember: (member: TeamMember) => void;
}

export const TeamMembersTableSection: React.FC<TeamMembersTableSectionProps> = ({ members, loading, error, errorMessage, onUpdateMember }) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleEditClick = (member: TeamMember) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t("team.member")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("team.status")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("team.role")}</Table.ColumnHeaderCell>
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
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.lastActive}</Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <Button size="1" variant="soft" onClick={() => handleEditClick(member)}>{t("team.edit")}</Button>
                    <Button size="1" variant="soft" color="red">{t("team.delete")}</Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <EditMemberModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        member={selectedMember}
        onSave={onUpdateMember}
      />
    </>
  );
};
