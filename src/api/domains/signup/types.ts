
export type SignupPayload = {
  action: "create";
  companyName: string;
  name: string;
  email: string;
  password: string;
  plan: string;
};

export type SignupResponse = {
  token: string;
};
