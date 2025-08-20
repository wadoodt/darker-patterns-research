import { Button, Container, Flex, Heading, Section, Text } from '@radix-ui/themes';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const CTASection: React.FC = () => {
  return (
    <Section
      size="4"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Container size="4">
        <Flex direction="column" gap="5" align="center">
          <Heading size="8" align="center" style={{ color: 'white' }}>
            Ready to transform your email marketing?
          </Heading>
          <Text size="4" align="center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Join thousands of businesses that trust Penguin Mails
          </Text>
          <Flex gap="4" wrap="wrap" justify="center">
            <Button size="4" style={{ background: 'white', color: '#667eea' }}>
              <a
                href="/signup"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
              >
                Start Free Trial
                <ArrowRight size={20} />
              </a>
            </Button>
            <Button size="4" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
              <a href="/demo" style={{ textDecoration: 'none', color: 'inherit' }}>
                Request Demo
              </a>
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Section>
  );
};

export default CTASection;
