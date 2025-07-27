import { Box, Table, Text, Flex, Button } from "@radix-ui/themes";
import type { FAQItem } from "types/faq";

export const FAQTableSection = ({
  faqs,
  isLoading,
  onUpdate,
  onDelete,
}: {
  faqs: FAQItem[];
  isLoading: boolean;
  onUpdate: (faq: FAQItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  if (isLoading) return <Text>Loading FAQs...</Text>;
  if (!faqs.length) return <Text>No FAQs found</Text>;

  return (
    <Box mb="4">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Question</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {faqs.map((faq) => (
            <Table.Row key={faq.id}>
              <Table.Cell>{faq.translations.en?.question || 'No question'}</Table.Cell>
              <Table.Cell>{faq.category}</Table.Cell>
              <Table.Cell>
                <Flex gap="3">
                  <Button size="1" variant="soft" onClick={() => onUpdate(faq)}>
                    Edit
                  </Button>
                  <Button 
                    size="1" 
                    variant="soft" 
                    color="red"
                    onClick={() => onDelete(faq.id)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
