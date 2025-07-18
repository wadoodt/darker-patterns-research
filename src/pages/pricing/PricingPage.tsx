import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@radix-ui/themes';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Briefcase, Star, MailQuestion, HelpCircle, Check } from 'lucide-react';

export default function PricingPage() {
  const { t } = useTranslation();
  const plans = ['business', 'premium', 'custom'] as const;
  const icons: Record<string, React.ReactNode> = {
    business: <Briefcase size={32} style={{ marginBottom: 8 }} />, 
    premium: <Star size={32} style={{ marginBottom: 8 }} />, 
    custom: <MailQuestion size={32} style={{ marginBottom: 8 }} />
  };

  return (
    <main>
      {/* Hero Section */}
      <section style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h1>{t('pricing.hero.title')}</h1>
        <p>{t('pricing.hero.description')}</p>
      </section>

      {/* Plans Grid */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 48 }}>
        {plans.map((planKey) => {
          const features = t(`pricing.plans.${planKey}.features`, { returnObjects: true });
          const featuresArray = Array.isArray(features) ? features as string[] : undefined;
          return (
            <Card key={planKey} style={{ minWidth: 320, maxWidth: 360, flex: 1 }}>
              <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
                {icons[planKey]}
                <h2>{t(`pricing.plans.${planKey}.title`)}</h2>
                <p>{t(`pricing.plans.${planKey}.description`)}</p>
                <div style={{ fontSize: 32, fontWeight: 'bold', marginTop: 8 }}>
                  {t(`pricing.plans.${planKey}.price`)}
                  {planKey !== 'custom' && (
                    <span style={{ fontSize: 18, fontWeight: 'normal', color: '#888', marginLeft: 4 }}>{t(`pricing.plans.${planKey}.interval`)}</span>
                  )}
                </div>
              </div>
              <div style={{ padding: '0 1.5rem' }}>
                <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                  {featuresArray ? featuresArray.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <Check size={16} style={{ marginRight: 8, color: 'green' }} /> {feature}
                    </li>
                  )) : <li>No features listed.</li>}
                </ul>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {planKey !== 'custom' ? (
                  <a href={`/signup?plan=${planKey}`} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.75rem', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
                    {t(`pricing.plans.${planKey}.ctaText`)}
                  </a>
                ) : (
                  <a href="/contact" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.75rem', border: '1px solid #111', color: '#111', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
                    {t('pricing.plans.custom.ctaText')}
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '3rem 0', background: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>{t('pricing.faq.title')}</h2>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {(() => {
            const faqItems = t('pricing.faq.items', { returnObjects: true });
            const faqArray = Array.isArray(faqItems) ? faqItems as { question: string; answer: string }[] : undefined;
            return faqArray ? (
              <Accordion type="single" collapsible>
                {faqArray.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                      <HelpCircle size={18} /> {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div style={{ padding: '1rem 0' }}>{item.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : <div>No FAQ items found.</div>;
          })()}
        </div>
      </section>
    </main>
  );
}
