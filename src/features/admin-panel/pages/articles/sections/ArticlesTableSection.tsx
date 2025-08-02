import { useTranslation } from "react-i18next";
import { Table, Button, Flex } from "@radix-ui/themes";
import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";

type ArticlesTableSectionProps = {
  articles: KnowledgeBaseArticle[];
  getLanguage: () => string;
  fallbackLanguage: string;
  handleEditClick: (article: KnowledgeBaseArticle) => void;
  handleDelete: (id: string) => Promise<null>;
  isLoading: boolean;
};

export function ArticlesTableSection({
  articles,
  getLanguage,
  fallbackLanguage,
  handleEditClick,
  handleDelete,
}: ArticlesTableSectionProps) {
  const lang = getLanguage();
  const { t } = useTranslation();

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            {t("articles.table.title")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            {t("articles.table.category")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            {t("articles.table.actions")}
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {articles.map((article) => {
          const translation =
            article.translations[lang] ||
            article.translations[fallbackLanguage];
          return (
            <Table.Row key={article.id}>
              <Table.RowHeaderCell>{translation?.title}</Table.RowHeaderCell>
              <Table.Cell>{translation?.category}</Table.Cell>
              <Table.Cell>
                <Flex gap="3">
                  <Button size="1" onClick={() => handleEditClick(article)}>
                    {t("common.edit")}
                  </Button>
                  <Button
                    size="1"
                    color="red"
                    onClick={() => handleDelete(article.id)}
                  >
                    {t("common.delete")}
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
