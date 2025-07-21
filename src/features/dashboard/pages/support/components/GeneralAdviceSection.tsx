
import { Heading, Grid, Card, Flex, Box, Text } from '@radix-ui/themes';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { KnowledgeBaseArticle } from '../../../../../types/knowledge-base';

const useGeneralAdviceArticles = (): KnowledgeBaseArticle[] => {
    const { t } = useTranslation();
    
    return [
        { 
            id: 'ga-1', 
            title: t('support.general_advice.articles.campaigns.title'), 
            description: t('support.general_advice.articles.campaigns.description'), 
            category: t('support.general_advice.articles.campaigns.category'), 
            url: '#', 
            translations: {}, 
        },
        { 
            id: 'ga-2', 
            title: t('support.general_advice.articles.domain_setup.title'), 
            description: t('support.general_advice.articles.domain_setup.description'), 
            category: t('support.general_advice.articles.domain_setup.category'), 
            url: '#', 
            translations: {} 
        },
        { 
            id: 'ga-3', 
            title: t('support.general_advice.articles.email_warmup.title'), 
            description: t('support.general_advice.articles.email_warmup.description'), 
            category: t('support.general_advice.articles.email_warmup.category'), 
            url: '#',
            translations: {}
        },
        { 
            id: 'ga-4', 
            title: t('support.general_advice.articles.deliverability.title'), 
            description: t('support.general_advice.articles.deliverability.description'), 
            category: t('support.general_advice.articles.deliverability.category'), 
            url: '#',
            translations: {}
        },
        { 
            id: 'ga-5', 
            title: t('support.general_advice.articles.templates.title'), 
            description: t('support.general_advice.articles.templates.description'), 
            category: t('support.general_advice.articles.templates.category'), 
            url: '#',
            translations: {}
        },
        { 
            id: 'ga-6', 
            title: t('support.general_advice.articles.lead_management.title'), 
            description: t('support.general_advice.articles.lead_management.description'), 
            category: t('support.general_advice.articles.lead_management.category'), 
            url: '#',
            translations: {}
        },
    ];
};

export const GeneralAdviceSection = () => {
    const { t } = useTranslation();
    const generalAdviceArticles = useGeneralAdviceArticles();
    
    return (
    <Box>
        <Heading as="h2" size="6" mb="4">
            <Flex align="center" gap="3">
                <HelpCircle /> 
                {t('support.general_advice.title')}
            </Flex>
        </Heading>
        <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
            {generalAdviceArticles.map((article) => (
                <Card key={article.id} asChild style={{ textDecoration: 'none' }}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <Flex direction="column" p="4" height="100%" justify="between">
                            <Box>
                                <Flex justify="between" align="start" mb="2">
                                    <Text size="2" color="gray">{article.category}</Text>
                                    <ExternalLink size={16} />
                                </Flex>
                                <Heading as="h3" size="4" mb="1">{article.title}</Heading>
                                <Text as="p" size="2" color="gray">{article.description}</Text>
                            </Box>
                        </Flex>
                    </a>
                </Card>
            ))}
        </Grid>
    </Box>
    );
};
