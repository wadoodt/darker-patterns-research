import { db } from "../db";
import type { User, Company } from "types/api";

type SignupPayload = Partial<User> &
  Partial<Pick<Company, "name" | "plan">> & {
    action: "create" | "join";
    companyName?: string;
    companyId?: string;
  };

export const validateCreatePayload = (
  payload: SignupPayload,
): string | null => {
  const { username, email, password, plan, companyName } = payload;
  if (!username || !email || !password || !plan || !companyName) {
    return "All fields for creating a company are required";
  }
  return null;
};

export const validateJoinPayload = (payload: SignupPayload): string | null => {
  const { username, email, password, companyId } = payload;
  if (!username || !email || !password || !companyId) {
    return "All fields for joining a company are required";
  }
  return null;
};

export const createCompanyAndAdminUser = (payload: SignupPayload) => {
  const { username, email, password, plan, companyName } = payload;
  const newCompany = db.companies.create({
    name: companyName!,
    plan: plan!,
    status: "active",
    stripeCustomerId: `cus_mock_${Date.now()}`,
  });
  db.users.create({
    name: username!,
    username: username!,
    email: email!,
    password: password!,
    companyId: newCompany.id,
    platformRole: "admin",
    status: "active",
  });
  return {
    responseData:
      plan !== "Free"
        ? { stripeUrl: "https://buy.stripe.com/test_mock_session" }
        : {},
  };
};

export const createUserForCompany = (payload: SignupPayload) => {
  const { username, email, password, companyId } = payload;
  db.users.create({
    name: username!,
    username: username!,
    email: email!,
    password: password!,
    companyId: companyId!,
    platformRole: "user",
    status: "created",
  });
};

export const findActiveCompanyById = (companyId: string) => {
  const company = db.companies.findFirst({ where: { id: companyId } });
  if (!company || company.status !== "active") {
    return null;
  }
  return company;
};
