import { Box, Card, Container, Flex, Heading, Section, Text } from '@radix-ui/themes';
import { FileText, Send, TrendingUp, Users } from 'lucide-react';
import React from 'react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Create Campaign',
      description: 'Design beautiful emails with our editor',
      icon: <FileText size={32} />,
    },
    {
      number: '2',
      title: 'Target Audience',
      description: 'Segment and personalize messages',
      icon: <Users size={32} />,
    },
    {
      number: '3',
      title: 'Send & Track',
      description: 'Launch and monitor in real-time',
      icon: <Send size={32} />,
    },
    {
      number: '4',
      title: 'Optimize',
      description: 'Improve with A/B testing',
      icon: <TrendingUp size={32} />,
    },
  ];

  return (
    <Section size="4" id="how-it-works" style={{ background: '#f8fafc' }}>
      <Container size="4">
        <Flex direction="column" gap="6">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="4">
              How It Works
            </Heading>
            <Text size="4" color="gray">
              Get started in minutes with our simple four-step process
            </Text>
          </Box>

          <Flex gap="4" wrap="wrap" justify="center">
            {steps.map((step, idx) => (
              <Card key={idx} style={{ flex: '1 1 250px', maxWidth: '280px' }}>
                <Flex direction="column" gap="3" p="5" align="center">
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {step.number}
                  </Flex>
                  <Box style={{ color: '#667eea' }}>{step.icon}</Box>
                  <Heading size="4">{step.title}</Heading>
                  <Text color="gray" align="center">
                    {step.description}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Section>
  );
};

export default HowItWorksSection;
