import React from "react";
import { Table, Flex, IconButton, DropdownMenu } from "@radix-ui/themes";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import type { KnowledgeBaseArticle } from "types/knowledge-base";

interface ArticlesTableSectionProps {
  articles: KnowledgeBaseArticle[];
  t: (key: string) => string;
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
          <Table.ColumnHeaderCell>{t("articlesPage.title")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("articlesPage.category")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {articles.map((article) => {
          const lang = getLanguage();
          const translation = article.translations[lang] || article.translations[fallbackLanguage];
          return (
            <Table.Row key={article.id}>
              <Table.Cell>{translation.title}</Table.Cell>
              <Table.Cell>{translation.category}</Table.Cell>
              <Table.Cell>
                <Flex justify="end">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="ghost">
                        <MoreHorizontal size={16} />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item onClick={() => handleEditClick(article)}>
                        <PencilIcon size={14} style={{ marginRight: "8px" }} />
                        {t("articlesPage.edit")}
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item color="red" onClick={() => handleDelete(article.id)}>
                        <TrashIcon size={14} style={{ marginRight: "8px" }} />
                        {t("articlesPage.delete")}
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