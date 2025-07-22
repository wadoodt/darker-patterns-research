import React, { useState } from 'react';
import { Heading, Grid, Card, Flex, Box, Text, Dialog, IconButton } from '@radix-ui/themes';
import { HelpCircle, Loader2, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { KnowledgeBaseArticle } from 'types/knowledge-base';

interface KnowledgeBaseSectionProps {
    articles: KnowledgeBaseArticle[];
    isLoading: boolean;
}

export const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({ articles, isLoading }) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
    
    return (
        <Box>
            <Heading as="h2" size="6" mb="4">
                <Flex align="center" gap="3">
                    <HelpCircle />
                    {t('support.knowledge_base.title')}
                </Flex>
            </Heading>
            {isLoading ? (
                <Flex align="center" justify="center" p="8">
                    <Loader2 className="animate-spin" size={32} />
                    <Text ml="4">{t('support.knowledge_base.loading')}</Text>
                </Flex>
        ) : (
            <Dialog.Root open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
                <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
                    {articles.map((article) => {
                        const translated = article.translations[currentLanguage] || article.translations.en;
                        return (
                            <Card key={article.id} className="cursor-pointer" onClick={() => setSelectedArticle(article)}>
                                <Flex direction="column" p="4" height="100%" justify="between">
                                    <Box>
                                        <Text size="2" color="gray" mb="2">{translated.category}</Text>
                                        <Heading as="h3" size="4" mb="1">{translated.title}</Heading>
                                        <Text as="p" size="2" color="gray">{translated.description}</Text>
                                    </Box>
                                </Flex>
                            </Card>
                        );
                    })}
                </Grid>

                {selectedArticle && (
                    <Dialog.Content style={{ maxWidth: 800 }}>
                        <Flex justify="between" align="center" mb="4">
                            <Dialog.Title>{(selectedArticle.translations[currentLanguage] || selectedArticle.translations.en).title}</Dialog.Title>
                            <Dialog.Close>
                                <IconButton variant="ghost" color="gray">
                                    <XIcon />
                                </IconButton>
                            </Dialog.Close>
                        </Flex>

                        <Dialog.Description>
                            {(selectedArticle.translations[currentLanguage] || selectedArticle.translations.en).body}
                        </Dialog.Description>
                    </Dialog.Content>
                )}
            </Dialog.Root>
        )}
        </Box>
    );
};
