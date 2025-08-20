import { Box, Button, Card, Container, Flex, Heading, Section, Text } from '@radix-ui/themes';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses',
      features: ['Up to 5,000 emails/month', 'Basic templates', 'Email support', 'Analytics dashboard'],
      recommended: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'For growing companies',
      features: [
        'Up to 50,000 emails/month',
        'Premium templates',
        'Priority support',
        'Advanced analytics',
        'A/B testing',
        'Custom domains',
      ],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: ['Unlimited emails', 'Custom templates', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
      recommended: false,
    },
  ];

  return (
    <Section size="4">
      <Container size="4">
        <Flex direction="column" gap="6">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="4">
              Simple, Transparent Pricing
            </Heading>
            <Text size="4" color="gray">
              Choose the perfect plan for your business needs
            </Text>
          </Box>

          <Flex gap="4" wrap="wrap" justify="center">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                style={{
                  flex: '1 1 300px',
                  maxWidth: '350px',
                  border: plan.recommended ? '2px solid #667eea' : undefined,
                  position: 'relative',
                }}
              >
                {plan.recommended && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '4px 16px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    MOST POPULAR
                  </Box>
                )}
                <Flex direction="column" gap="4" p="5">
                  <Box>
                    <Heading size="5">{plan.name}</Heading>
                    <Text color="gray">{plan.description}</Text>
                  </Box>
                  <Box>
                    <Text size="8" weight="bold">
                      {plan.price}
                    </Text>
                    <Text color="gray">{plan.period}</Text>
                  </Box>
                  <Flex direction="column" gap="2">
                    {plan.features.map((feature, fidx) => (
                      <Flex key={fidx} gap="2" align="center">
                        <CheckCircle2 size={16} color="#10b981" />
                        <Text size="2">{feature}</Text>
                      </Flex>
                    ))}
                  </Flex>
                  <Button
                    size="3"
                    style={{
                      width: '100%',
                      background: plan.recommended ? 'linear-gradient(135deg, #667eea, #764ba2)' : undefined,
                    }}
                    variant={plan.recommended ? 'solid' : 'soft'}
                  >
                    <a href="/signup" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </a>
                  </Button>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Section>
  );
};

export default PricingSection;
