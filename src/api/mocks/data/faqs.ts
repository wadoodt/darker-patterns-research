import type { FaqItem } from "@api/domains/faq/types";

const mockPricingFaqs: FaqItem[] = [
  {
    id: "pricing-1",
    category: "pricing",
    translations: {
      en: {
        question: "Is there a free tier or trial?",
        answer:
          "No, we currently do not offer a free tier or a traditional free trial. However, you can explore the platform using our test account to see how things work. Use credentials: Email: `test@email.com` Password: `Test#1234` Business ID: `Test1234567890` Referral Code: `Test1234567890` Please note that actions within this test account are mocked and no real emails are sent or domains warmed up. When you're ready to use the service actively, please select one of our paid plans.",
      },
    },
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-01-01T12:00:00Z",
  },
  {
    id: "pricing-2",
    category: "pricing",
    translations: {
      en: {
        question: "What payment methods do you accept?",
        answer:
          "We use Stripe as our payment processor. This allows us to accept a wide variety of payment methods, including major credit cards (Visa, Mastercard, American Express), debit cards, and potentially other regional payment options like SEPA Direct Debit, iDEAL, etc., depending on your location.",
      },
    },
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-01-01T12:00:00Z",
  },
  {
    id: "pricing-3",
    category: "pricing",
    translations: {
      en: {
        question: "I don't like some part of the plan or have suggestions.",
        answer:
          "We appreciate your feedback! If specific features in the Business or Premium plans don't perfectly fit your needs, or if you have suggestions for improvement, please reach out to us via our Contact Us page. For highly specific requirements or significant modifications, the 'Custom' plan is designed to offer tailored solutions. Contact our sales team to discuss how we can build a plan that works best for you.",
      },
    },
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-01-01T12:00:00Z",
  },
  {
    id: "pricing-4",
    category: "pricing",
    translations: {
      en: {
        question: "Can I get a discount?",
        answer:
          "We occasionally offer promotions or discounts, especially for annual commitments or non-profit organizations. Please contact our sales or support team through the Contact Us page to inquire about any current offers or discuss potential discounts based on your specific situation (e.g., volume, commitment length). Choosing the 'Custom' plan also allows for negotiation based on the scope of services.",
      },
    },
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-01-01T12:00:00Z",
  },
];

const mockHomeFaqs: FaqItem[] = [
    {
        id: "home-1",
        category: "home",
        translations: {
            en: {
                question: "Is this just an AI wrapper for writing emails?",
                answer: "No, Penguin Mails focuses on deliverability and automation. We use advanced algorithms and bot networks to warm up your domains, ensuring emails from newly acquired domains don't get flagged as spam. While we do offer AI assistance for redacting email templates within campaigns, our core value lies in building sender reputation and automating outreach sequences. We also use AI to analyze campaign performance, detect anomalies like high bounce rates or spam complaints, and provide actionable insights, distinct from simple A/B testing (which we also support)."
            }
        },
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-01T12:00:00Z"
    },
    {
        id: "home-2",
        category: "home",
        translations: {
            en: {
                question: "My boss told me to use the platform, but login isn't working.",
                answer: "If you're joining an existing business account on Penguin Mails, you typically need to be invited by an administrator from your company. Ask your boss for the specific referral link they can generate, or at minimum, the `businessId` and `referral code` found in their company settings view. The easiest way is often for your boss (or an admin) to add your email address directly within their Penguin Mails account, which will trigger an invitation or account setup process for you."
            }
        },
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-01T12:00:00Z"
    },
    {
        id: "home-3",
        category: "home",
        translations: {
            en: {
                question: "Do you guarantee 100% email delivery rates?",
                answer: "We implement best practices and robust techniques, including domain warm-up and DMARC configuration guidance, to maximize your email deliverability. However, achieving a 100% delivery rate is practically impossible due to factors beyond our control. Email providers might have overly aggressive spam filters, recipient servers could be temporarily down, or end-users might incorrectly mark emails as spam or simply never open them. While we strive for the highest possible inbox placement and provide tools to monitor and improve your rates, we cannot guarantee every single email will be delivered. We are committed to helping you achieve campaign success within these realities."
            }
        },
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-01T12:00:00Z"
    },
    {
        id: "home-4",
        category: "home",
        translations: {
            en: {
                question: "What are Handlebars templates?",
                answer: "Handlebars is a simple templating language. It allows you to create dynamic email content by inserting variables (like {{firstName}} or {{companyName}}) into your email templates. When you send a campaign, Penguin Mails replaces these variables with the actual data from your contact list, personalizing each email. You can also use basic logic like conditional statements ({{#if}}) within your templates."
            }
        },
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-01T12:00:00Z"
    }
];

export const mockFaqs: FaqItem[] = [...mockPricingFaqs, ...mockHomeFaqs];
