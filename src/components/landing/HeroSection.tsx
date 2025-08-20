'use client';
import { Box, Card, Container, Flex, Heading, Section, Text } from '@radix-ui/themes';
import { ArrowRight, Inbox, Send, Sparkles, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [emailCount, setEmailCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailCount((prev) => {
        const next = prev + Math.floor(Math.random() * 10) + 5;
        return next > 50000 ? 50000 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Section
      size="4"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container size="4">
        <Flex direction="column" align="center" gap="6">
          {/* Badge */}
          <Box
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 20px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Flex align="center" gap="2">
              <Sparkles size={16} color="white" />
              <Text size="2" style={{ color: 'white' }}>
                Trusted by thousands of businesses worldwide
              </Text>
            </Flex>
          </Box>

          {/* Main Title */}
          <Heading size="9" align="center" style={{ color: 'white', maxWidth: '800px' }}>
            {t('pricing.hero.title', 'Transform Your Email Marketing with')}{' '}
            <span
              style={{
                background: 'linear-gradient(to right, #ffd89b, #19547b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Penguin Mails
            </span>
          </Heading>

          {/* Description */}
          <Text size="5" align="center" style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px' }}>
            {t(
              'pricing.hero.description',
              'Send beautiful, personalized emails at scale with the most reliable email platform',
            )}
          </Text>

          {/* CTA Button text */}
          <a
            href="/signup"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
          >
            {t('pricing.plans.business.ctaText', 'Start Free Trial')}
            <ArrowRight size={20} />
          </a>

          {/* Simple Mockup */}
          <Card style={{ width: '100%', maxWidth: '800px', marginTop: '40px' }}>
            <Flex direction="column" gap="4" p="4">
              <Flex gap="2">
                <Box style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
                <Box style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                <Box style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28ca42' }} />
              </Flex>
              <Flex gap="4" wrap="wrap" justify="center">
                <Card>
                  <Flex direction="column" gap="2" p="4" align="center">
                    <Send size={32} color="#667eea" />
                    <Text weight="bold">Send Campaign</Text>
                    <Text size="2" color="gray">
                      Launch targeted campaigns
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="4" align="center">
                    <Inbox size={32} color="#764ba2" />
                    <Text weight="bold">Track Opens</Text>
                    <Text size="2" color="gray">
                      Real-time metrics
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="4" align="center">
                    <TrendingUp size={32} color="#667eea" />
                    <Text weight="bold">Analyze</Text>
                    <Text size="2" color="gray">
                      Data-driven insights
                    </Text>
                  </Flex>
                </Card>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Section>
  );
};

export default HeroSection;
