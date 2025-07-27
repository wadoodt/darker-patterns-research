import { Flex, Heading, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

export const HeaderSection = ({
  onCreate,
}: {
  onCreate: () => void;
}) => (
  <Flex justify="between" align="center" mb="4">
    <Heading size="5">FAQ Management</Heading>
    <Button onClick={onCreate}>
      <PlusIcon width="16" height="16" /> Create FAQ
    </Button>
  </Flex>
);
