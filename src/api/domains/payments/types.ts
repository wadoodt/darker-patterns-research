
export type PaymentStatus = "pending" | "succeeded" | "failed";

export type Payment = {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  created: string;
};

export type CreatePaymentPayload = {
  amount: number;
  currency: string;
};
