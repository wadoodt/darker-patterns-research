import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({ isOpen, onClose, onConfirm, memberName }) => {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{t("team.delete_member_title")}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          <Text>
            {t("team.delete_member_confirmation", { name: memberName })}
          </Text>
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {t("team.cancel")}
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button variant="solid" color="red" onClick={onConfirm}>
              {t("team.confirm_delete")}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteMemberModal;
