import React from "react";
import { Card, Flex, Box, Text, Heading, Container, Section } from "@radix-ui/themes";
import { 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Globe,
  Lock
} from "lucide-react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Send thousands of emails in seconds",
      color: "#fbbf24"
    },
    {
      icon: <Shield size={24} />,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance",
      color: "#10b981"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Advanced Analytics",
      description: "Track opens, clicks, and conversions",
      color: "#3b82f6"
    },
    {
      icon: <Globe size={24} />,
      title: "Global Delivery",
      description: "Reach inboxes worldwide",
      color: "#8b5cf6"
    },
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description: "Work together with your team",
      color: "#ec4899"
    },
    {
      icon: <Lock size={24} />,
      title: "GDPR Compliant",
      description: "Full compliance with regulations",
      color: "#6366f1"
    }
  ];

  return (
    <Section size="4" id="features">
      <Container size="4">
        <Flex direction="column" gap="6">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="4">Everything you need to succeed</Heading>
            <Text size="4" color="gray">
              Powerful features designed to help you create, send, and track email campaigns
            </Text>
          </Box>

          <Flex gap="4" wrap="wrap" justify="center">
            {features.map((feature, idx) => (
              <Card key={idx} style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                <Flex direction="column" gap="3" p="5">
                  <Box style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px',
                    background: `${feature.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feature.color
                  }}>
                    {feature.icon}
                  </Box>
                  <Heading size="4">{feature.title}</Heading>
                  <Text color="gray">{feature.description}</Text>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Section>
  );
};

export default FeaturesSection;