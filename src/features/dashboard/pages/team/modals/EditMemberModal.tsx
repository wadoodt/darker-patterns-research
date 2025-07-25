import { Dialog, Button, Flex, Text, Select } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { User, CompanyRole } from "types/api/user";

interface EditMemberModalProps {
  member: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: User) => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [editedMember, setEditedMember] = useState<User | null>(member);

  useEffect(() => {
    setEditedMember(member);
  }, [member]);

  if (!editedMember) return null;

  const handleRoleChange = (value: string) => {
    if (editedMember) {
      setEditedMember({ ...editedMember, companyRole: value as CompanyRole });
    }
  };

  const handleSave = () => {
    if (editedMember) {
      onSave(editedMember);
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{t("team.edit")} Member</Dialog.Title>

        <Flex direction="column" gap="3" mt="4">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              {t("team.role")}
            </Text>
            <Select.Root
              value={editedMember.companyRole}
              onValueChange={handleRoleChange}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="admin">Admin</Select.Item>
                <Select.Item value="user">User</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              {t("team.status")}
            </Text>
            <Select.Root
              value={editedMember.status}
              onValueChange={(value: 'active' | 'invited' | 'inactive') => setEditedMember({ ...editedMember, status: value })}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="active">Active</Select.Item>
                <Select.Item value="invited">Invited</Select.Item>
                <Select.Item value="inactive">Inactive</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {t("common.cancel")}
            </Button>
          </Dialog.Close>
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditMemberModal;
