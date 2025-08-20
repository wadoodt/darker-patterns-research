'use client';

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Inbox,
  Lock,
  Mail,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [emailCount, setEmailCount] = useState(0);
  const [openFaqItems, setOpenFaqItems] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailCount((prev) => {
        const next = prev + Math.floor(Math.random() * 100) + 50;
        return next > 50000 ? 50000 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleFaqItem = (id: string) => {
    setOpenFaqItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const features = [
    {
      icon: <Zap />,
      title: 'Lightning Fast',
      description: 'Send thousands of emails in seconds',
      color: 'bg-yellow-500',
    },
    {
      icon: <Shield />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance',
      color: 'bg-green-500',
    },
    {
      icon: <BarChart3 />,
      title: 'Advanced Analytics',
      description: 'Track opens, clicks, and conversions',
      color: 'bg-blue-500',
    },
    { icon: <Globe />, title: 'Global Delivery', description: 'Reach inboxes worldwide', color: 'bg-purple-500' },
    { icon: <Users />, title: 'Team Collaboration', description: 'Work together with your team', color: 'bg-pink-500' },
    {
      icon: <Lock />,
      title: 'GDPR Compliant',
      description: 'Full compliance with regulations',
      color: 'bg-indigo-500',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Campaign',
      description: 'Design beautiful emails with our editor',
      icon: <FileText />,
    },
    { number: '2', title: 'Target Audience', description: 'Segment and personalize messages', icon: <Users /> },
    { number: '3', title: 'Send & Track', description: 'Launch and monitor in real-time', icon: <Send /> },
    { number: '4', title: 'Optimize', description: 'Improve with A/B testing', icon: <TrendingUp /> },
  ];

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

  const faqs = [
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}
      >
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-white md:hidden">
            <div className="space-y-1 px-4 pt-2 pb-3">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                Features
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                How It Works
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                Pricing
              </a>
              <a href="#faq" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                FAQ
              </a>
              <button className="mt-4 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-white">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-pink-300/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm text-white">Trusted by 10,000+ businesses worldwide</span>
          </div>

          <h1 className="mb-6 text-5xl leading-tight font-bold text-white md:text-7xl">
            Transform Your Email
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Marketing Today
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl text-white/90 md:text-2xl">
            Send beautiful, personalized emails at scale with the most reliable email platform
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </button>
            <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/10">
              Watch Demo
            </button>
          </div>

          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                <Send className="mb-4 h-10 w-10 text-purple-600" />
                <h3 className="mb-2 font-semibold text-gray-800">Send Campaign</h3>
                <p className="text-sm text-gray-600">Launch targeted campaigns in minutes</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <Inbox className="mb-4 h-10 w-10 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-800">Track Opens</h3>
                <p className="text-sm text-gray-600">Real-time engagement metrics</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                <TrendingUp className="mb-4 h-10 w-10 text-green-600" />
                <h3 className="mb-2 font-semibold text-gray-800">Analyze Results</h3>
                <p className="text-sm text-gray-600">Data-driven insights for growth</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                {emailCount.toLocaleString()}+
              </span>
              <p className="text-gray-600">Emails sent this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Everything you need to succeed</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Powerful features designed to help you create, send, and track email campaigns
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`h-14 w-14 ${feature.color} bg-opacity-20 mb-6 flex items-center justify-center rounded-xl`}
                >
                  <div className={`${feature.color} bg-opacity-100 rounded-lg p-3 text-white`}>{feature.icon}</div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Get started in minutes with our simple four-step process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < steps.length - 1 && (
                  <div className="absolute top-12 left-full -z-10 hidden h-0.5 w-full bg-gradient-to-r from-purple-300 to-pink-300 lg:block"></div>
                )}
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-3xl font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                  <div className="mb-4 flex justify-center text-purple-600">{step.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Simple, Transparent Pricing</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">Choose the perfect plan for your business needs</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl bg-white ${plan.recommended ? 'scale-105 shadow-xl ring-2 ring-purple-600' : 'shadow-lg'} p-8 transition-all duration-300 hover:shadow-xl`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 text-sm font-semibold text-white">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mb-4 text-gray-600">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="ml-2 text-gray-600">{plan.period}</span>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about Penguin Mails</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="overflow-hidden rounded-xl bg-gray-50">
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-100"
                  onClick={() => toggleFaqItem(faq.id)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaqItems.has(faq.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaqItems.has(faq.id) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 py-20">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-pink-300/10 blur-3xl"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Ready to transform your email marketing?</h2>
          <p className="mb-8 text-xl text-white/90">Join thousands of businesses that trust Penguin Mails</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </button>
            <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/10">
              Request Demo
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Mail className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold">Penguin Mails</span>
              </div>
              <p className="text-gray-400">The most reliable email marketing platform for modern businesses.</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Penguin Mails. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
