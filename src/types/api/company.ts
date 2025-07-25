export type CompanyPlan = "Free" | "Pro" | "Enterprise";
export type CompanyStatus = "active" | "inactive" | "past_due";

export type Company = {
  id: string;
  name: string;

  // Billing & Subscription
  stripeCustomerId?: string;
  plan: CompanyPlan;
  status: CompanyStatus;

  // Legal & Contact
  officialEmail?: string;
  taxId?: string;
  taxIdCountry?: string;

  // Note: ownerId has been removed in favor of role-based ownership
};
