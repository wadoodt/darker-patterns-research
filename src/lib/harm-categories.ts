export interface HarmCategory {
  id: string;
  name: string;
  description: string;
}

export const HARM_CATEGORIES: HarmCategory[] = [
  {
    id: 'psychological-harm',
    name: 'Psychological Harm',
    description:
      'AI outputs that undermine mental health, distort reality, or erode logical reasoning. This includes manipulative content, misinformation, and cognitive manipulation that damages critical thinking.',
  },
  {
    id: 'physical-harm-indirect',
    name: 'Physical Harm (Indirect)',
    description:
      'Advice or narratives that indirectly lead to bodily injury or health risks—such as dangerous medical suggestions, self-harm encouragement, or unsafe practices.',
  },
  {
    id: 'reputational-legal-harm',
    name: 'Reputational & Legal Harm',
    description:
      'Damage to individual or organizational reputation through misinformation, defamation, impersonation, or unauthorized data exposure—combined with legal risks from unlawful advice, regulatory breaches, and copyright violations.',
  },
  {
    id: 'economic-harm',
    name: 'Economic Harm',
    description:
      'Financial loss or instability caused by scams, bad financial advice, market manipulation, or exploitative practices.',
  },
  {
    id: 'privacy-violations',
    name: 'Privacy Violations',
    description:
      'Unauthorized disclosure or inference of personal, sensitive, or identifying information, leading to confidentiality breaches and security risks.',
  },
  {
    id: 'social-cultural-harm',
    name: 'Social & Cultural Harm',
    description:
      'Content that fuels discrimination, hate speech, polarization, or erosion of social cohesion and trust in institutions.',
  },
  {
    id: 'autonomy-agency-erosion',
    name: 'Autonomy & Agency Erosion',
    description:
      'Undermining user free will by coercion, dark patterns, biased recommendations, or over-reliance prompts that weaken decision-making capacity.',
  },
];
