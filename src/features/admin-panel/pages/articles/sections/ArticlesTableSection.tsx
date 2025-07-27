import React from "react";
import { Table, Flex, Button, DropdownMenu } from "@radix-ui/themes";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import type { TFunction } from "i18next";
import type { KnowledgeBaseArticle } from "types/knowledge-base";

interface ArticlesTableSectionProps {
  articles: KnowledgeBaseArticle[];
  t: TFunction;
  getLanguage: () => string;
  fallbackLanguage: string;
  handleEditClick: (article: KnowledgeBaseArticle) => void;
  handleDelete: (id: string) => void;
  isLoading: boolean;
}

export const ArticlesTableSection: React.FC<ArticlesTableSectionProps> = ({
  articles,
  t,
  getLanguage,
  fallbackLanguage,
  handleEditClick,
  handleDelete,
  isLoading,
}) => {
  if (isLoading) return <p>Loading articles...</p>;
  if (!articles) return null;
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            {t("articles.title")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            {t("articles.category")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {articles.map((article) => {
          const translation = article.translations[getLanguage()] || 
                            article.translations[fallbackLanguage];
          return (
            <Table.Row key={article.id}>
              <Table.Cell>{translation.title}</Table.Cell>
              <Table.Cell>{translation.category}</Table.Cell>
              <Table.Cell>
                <Flex gap="2" justify="end">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="soft" size="1">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onClick={() => handleEditClick(article)}
                      >
                        <PencilIcon size={14} style={{ marginRight: "8px" }} />
                        {t("articles.edit")}
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item
                        color="red"
                        onClick={() => handleDelete(article.id)}
                      >
                        <TrashIcon size={14} style={{ marginRight: "8px" }} />
                        {t("articles.delete")}
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Flex>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};
