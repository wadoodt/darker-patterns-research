import React from "react";
import { Flex, Button, Dialog } from "@radix-ui/themes";

interface ModalActionsSectionProps {
  onClose: () => void;
  saving: boolean;
  t: (key: string) => string;
  saveLabel: string;
}

export const ModalActionsSection: React.FC<ModalActionsSectionProps> = ({
  onClose,
  saving,
  t,
  saveLabel,
}) => (
  <Flex mt="4" gap="3" justify="end">
    <Dialog.Close>
      <Button variant="soft" color="gray" type="button" onClick={onClose}>
        {t("common.cancel")}
      </Button>
    </Dialog.Close>
    <Button type="submit" loading={saving} disabled={saving}>
      {saveLabel}
    </Button>
  </Flex>
);
