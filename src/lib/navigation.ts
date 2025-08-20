// src/lib/navigation.ts

export interface NavLink {
  href: string;
  label: string;
  group: 'info' | 'landing' | 'admin' | 'survey' | 'auth';
}

export const navLinks: NavLink[] = [
  // Main Navigation used in Navbars
  { href: '/about-research', label: 'About', group: 'landing' },
  { href: '/benefits', label: 'Benefits', group: 'landing' },
  { href: '/researchers', label: 'Researchers', group: 'landing' },

  // Footer & Other Links
  { href: '/ethics-privacy-participation', label: 'Ethics & Privacy', group: 'info' },
  { href: '/terms-conditions', label: 'Terms & Conditions', group: 'info' },
  { href: '/contact-us', label: 'Contact Us', group: 'info' },
  { href: '/login', label: 'Researcher Login', group: 'auth' },
  { href: '/step-introduction', label: 'Start Survey', group: 'survey' },
];

// Helper function to easily find a link's group by its path
export const getLinkGroup = (path: string): NavLink['group'] | undefined => {
  return navLinks.find((link) => link.href === path)?.group;
};
