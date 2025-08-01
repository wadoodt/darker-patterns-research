export * from "./auth";
export * from "./support";

export interface AdminSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  maxTeamMembers: number;
  maxDomains: number;
  maintenanceMode: boolean;
  featureFlags?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  plan: string;
  status: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
