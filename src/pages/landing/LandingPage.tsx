import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Flex, Box, Text, Heading, Container, Section } from "@radix-ui/themes";
import { 
  Mail, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  Inbox,
  FileText,
  TrendingUp
} from "lucide-react";
import { useFaqs } from "@api/domains/faq/hooks";
import type { FaqItem } from "@api/domains/faq/types";

// Hero Section
const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const [emailCount, setEmailCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailCount(prev => {
        const next = prev + Math.floor(Math.random() * 10) + 5;
        return next > 50000 ? 50000 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Section size="4" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container size="4">
        <Flex direction="column" align="center" gap="6">
          {/* Badge */}
          <Box style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 20px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <Flex align="center" gap="2">
              <Sparkles size={16} color="white" />
              <Text size="2" style={{ color: 'white' }}>
                Trusted by thousands of businesses worldwide
              </Text>
            </Flex>
          </Box>

          {/* Main Title */}
          <Heading size="9" align="center" style={{ color: 'white', maxWidth: '800px' }}>
            {t("pricing.hero.title")}{" "}
            <span style={{ 
              background: 'linear-gradient(to right, #ffd89b, #19547b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Penguin Mails
            </span>
          </Heading>

          {/* Description */}
          <Text size="5" align="center" style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px' }}>
            {t("pricing.hero.description")}
          </Text>

          {/* Stats */}
          <Flex gap="6" wrap="wrap" justify="center">
            <Flex align="center" gap="2">
              <Mail size={20} color="white" />
              <Text size="6" weight="bold" style={{ color: 'white' }}>
                {emailCount.toLocaleString()}+
              </Text>
              <Text size="3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Emails Sent
              </Text>
            </Flex>
            <Flex align="center" gap="2">
              <Users size={20} color="white" />
              <Text size="6" weight="bold" style={{ color: 'white' }}>
                99.9%
              </Text>
              <Text size="3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Delivery Rate
              </Text>
            </Flex>
            <Flex align="center" gap="2">
              <Shield size={20} color="white" />
              <Text size="6" weight="bold" style={{ color: 'white' }}>
                SOC 2
              </Text>
              <Text size="3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Compliant
              </Text>
            </Flex>
          </Flex>

          {/* CTA Buttons */}
          <Flex gap="4" wrap="wrap" justify="center">
            <Button size="4" style={{ background: 'white', color: '#667eea' }}>
              <a href="/signup" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                {t("pricing.plans.business.ctaText")}
                <ArrowRight size={20} />
              </a>
            </Button>
            <Button size="4" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
              <a href="#features" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                Explore Features
                <ChevronDown size={20} />
              </a>
            </Button>
          </Flex>

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
                    <Text size="2" color="gray">Launch targeted campaigns</Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="4" align="center">
                    <Inbox size={32} color="#764ba2" />
                    <Text weight="bold">Track Opens</Text>
                    <Text size="2" color="gray">Real-time metrics</Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="4" align="center">
                    <TrendingUp size={32} color="#667eea" />
                    <Text weight="bold">Analyze</Text>
                    <Text size="2" color="gray">Data-driven insights</Text>
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

// Features Section
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

// How It Works Section
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1",
      title: "Create Campaign",
      description: "Design beautiful emails with our editor",
      icon: <FileText size={32} />
    },
    {
      number: "2",
      title: "Target Audience",
      description: "Segment and personalize messages",
      icon: <Users size={32} />
    },
    {
      number: "3",
      title: "Send & Track",
      description: "Launch and monitor in real-time",
      icon: <Send size={32} />
    },
    {
      number: "4",
      title: "Optimize",
      description: "Improve with A/B testing",
      icon: <TrendingUp size={32} />
    }
  ];

  return (
    <Section size="4" id="how-it-works" style={{ background: '#f8fafc' }}>
      <Container size="4">
        <Flex direction="column" gap="6">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="4">How It Works</Heading>
            <Text size="4" color="gray">
              Get started in minutes with our simple four-step process
            </Text>
          </Box>

          <Flex gap="4" wrap="wrap" justify="center">
            {steps.map((step, idx) => (
              <Card key={idx} style={{ flex: '1 1 250px', maxWidth: '280px' }}>
                <Flex direction="column" gap="3" p="5" align="center">
                  <Flex align="center" justify="center" style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {step.number}
                  </Flex>
                  <Box style={{ color: '#667eea' }}>{step.icon}</Box>
                  <Heading size="4">{step.title}</Heading>
                  <Text color="gray" align="center">{step.description}</Text>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Section>
  );
};

// Pricing Section
const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "Up to 5,000 emails/month",
        "Basic templates",
        "Email support",
        "Analytics dashboard"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "For growing companies",
      features: [
        "Up to 50,000 emails/month",
        "Premium templates",
        "Priority support",
        "Advanced analytics",
        "A/B testing",
        "Custom domains"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited emails",
        "Custom templates",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee"
      ],
      recommended: false
    }
  ];

  return (
    <Section size="4">
      <Container size="4">
        <Flex direction="column" gap="6">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="4">Simple, Transparent Pricing</Heading>
            <Text size="4" color="gray">
              Choose the perfect plan for your business needs
            </Text>
          </Box>

          <Flex gap="4" wrap="wrap" justify="center">
            {plans.map((plan, idx) => (
              <Card key={idx} style={{ 
                flex: '1 1 300px', 
                maxWidth: '350px',
                border: plan.recommended ? '2px solid #667eea' : undefined,
                position: 'relative'
              }}>
                {plan.recommended && (
                  <Box style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    MOST POPULAR
                  </Box>
                )}
                <Flex direction="column" gap="4" p="5">
                  <Box>
                    <Heading size="5">{plan.name}</Heading>
                    <Text color="gray">{plan.description}</Text>
                  </Box>
                  <Box>
                    <Text size="8" weight="bold">{plan.price}</Text>
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
                      background: plan.recommended ? 'linear-gradient(135deg, #667eea, #764ba2)' : undefined
                    }}
                    variant={plan.recommended ? "solid" : "soft"}
                  >
                    <a href="/signup" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
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

// FAQ Section
const FAQSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data, loading: isLoading, error } = useFaqs({ category: "home" });
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const faqs = React.useMemo(() => data?.faqs || [], [data]);
  const currentLanguage = i18n.language;

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Section size="4" style={{ background: '#f8fafc' }}>
        <Container size="4">
          <Text align="center">Loading FAQs...</Text>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section size="4" style={{ background: '#f8fafc' }}>
        <Container size="4">
          <Text align="center" color="red">Error loading FAQs</Text>
        </Container>
      </Section>
    );
  }

  return (
    <Section size="4" id="faq" style={{ background: '#f8fafc' }}>
      <Container size="3">
        <Flex direction="column" gap="6">
          <Box style={{ textAlign: 'center' }}>
            <Heading size="8" mb="4">{t("pricing.faq.title")}</Heading>
            <Text size="4" color="gray">
              Everything you need to know about Penguin Mails
            </Text>
          </Box>

          <Flex direction="column" gap="3">
            {faqs.map((faq: FaqItem) => {
              const translation = faq.translations[currentLanguage] ?? faq.translations.en;
              const isOpen = openItems.has(faq.id);
              
              return (
                <Card key={faq.id} style={{ cursor: 'pointer' }} onClick={() => toggleItem(faq.id)}>
                  <Box p="4">
                    <Flex justify="between" align="center">
                      <Text size="3" weight="bold" style={{ flex: 1 }}>
                        {translation.question}
                      </Text>
                      {isOpen ? (
                        <ChevronUp size={20} color="gray" />
                      ) : (
                        <ChevronDown size={20} color="gray" />
                      )}
                    </Flex>
                    {isOpen && (
                      <Box mt="3">
                        <Text color="gray">
                          {translation.answer}
                        </Text>
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

// CTA Section
const CTASection: React.FC = () => {
  return (
    <Section size="4" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
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
              <a href="/signup" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
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

// Main Landing Page Component
const LandingPage: React.FC = () => {
  useTranslation();
  
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
};

export default LandingPage;