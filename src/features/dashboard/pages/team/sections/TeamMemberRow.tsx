import { Table, Badge, Button, Flex, Switch, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { User } from "types/api/user";
import { useAuth } from "contexts/AuthContext";

interface TeamMemberRowProps {
  member: User;
  canEdit: boolean;
  canDelete: boolean;
  canManageRoles: boolean;
  onEdit: (member: User) => void;
  onDelete: (member: User) => void;
  onUpdatePlatformRole: (memberId: string, platformRole: "admin" | "user") => void;
}

export const TeamMemberRow = ({
  member,
  canEdit,
  canDelete,
  canManageRoles,
  onEdit,
  onDelete,
  onUpdatePlatformRole,
}: TeamMemberRowProps) => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();

  return (
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
          {canEdit && (
            <Button size="1" variant="soft" onClick={() => onEdit(member)}>{t("team.edit")}</Button>
          )}
          {canDelete && (
            <Button size="1" variant="soft" color="red" onClick={() => onDelete(member)}>{t("team.delete")}</Button>
          )}
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};
