
export type PaymentStatus = "pending" | "succeeded" | "failed";

export type Payment = {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
  companyId: string;
  userId: string;
  stripeSessionId: string;
};

export type CreatePaymentPayload = {
  amount: number;
  currency: string;
};
