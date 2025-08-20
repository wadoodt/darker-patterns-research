'use client';

import { Box, Card, Container, Flex, Heading, Section, Text } from '@radix-ui/themes';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Local FAQ data type
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Static FAQ data - you can move this to a separate file later
  const faqs: FaqItem[] = [
    {
      id: '1',
      question: 'How many emails can I send per month?',
      answer:
        'It depends on your plan. Starter plans allow up to 5,000 emails/month, Professional up to 50,000, and Enterprise plans offer unlimited sending.',
    },
    {
      id: '2',
      question: 'Do you provide email templates?',
      answer:
        'Yes! We offer a wide range of professionally designed templates for various industries and use cases. Premium plans get access to exclusive templates.',
    },
    {
      id: '3',
      question: 'What kind of analytics do you provide?',
      answer:
        'We provide comprehensive analytics including open rates, click-through rates, bounce rates, conversion tracking, and geographic data about your recipients.',
    },
    {
      id: '4',
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required to start your trial.',
    },
    {
      id: '5',
      question: 'Can I import my existing email list?',
      answer:
        'Absolutely! You can easily import your contacts via CSV, Excel files, or integrate directly with popular CRM systems.',
    },
    {
      id: '6',
      question: 'What about GDPR and compliance?',
      answer:
        "We're fully GDPR compliant and provide tools to help you maintain compliance, including consent management, data portability, and automatic data retention policies.",
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <Section size="4" id="faq" style={{ background: '#f8fafc' }}>
      <Container size="3">
        <Flex direction="column" gap="6">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="4">
              Frequently Asked Questions
            </Heading>
            <Text size="4" color="gray">
              Everything you need to know about Penguin Mails
            </Text>
          </Box>

          <Flex direction="column" gap="3">
            {faqs.map((faq) => {
              const isOpen = openItems.has(faq.id);

              return (
                <Card key={faq.id} style={{ cursor: 'pointer' }} onClick={() => toggleItem(faq.id)}>
                  <Box p="4">
                    <Flex justify="between" align="center">
                      <Text size="3" weight="bold" style={{ flex: 1 }}>
                        {faq.question}
                      </Text>
                      {isOpen ? <ChevronUp size={20} color="gray" /> : <ChevronDown size={20} color="gray" />}
                    </Flex>
                    {isOpen && (
                      <Box mt="3">
                        <Text color="gray">{faq.answer}</Text>
                      </Box>
                    )}
                  </Box>
                </Card>
              );
            })}
          </Flex>
        </Flex>
      </Container>
    </Section>
  );
};

export default FAQSection;
