
export type CompanyPlan = "Free" | "Pro" | "Enterprise";
export type CompanyStatus = "active" | "inactive" | "past_due";

export type Company = {
  id: string;
  name: string;
  stripeCustomerId?: string;
  plan: CompanyPlan;
  status: CompanyStatus;
  officialEmail?: string;
  taxId?: string;
  taxIdCountry?: string;
};

export type CompaniesResponse = {
  companies: Company[];
}; 