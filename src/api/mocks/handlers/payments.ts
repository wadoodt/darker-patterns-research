// src/api/mocks/handlers/payments-handler.ts
import { db } from "../db";
import { createSuccessResponse, createErrorResponse } from "../../response";
import type { PaymentStatus } from "@api/domains/payments/types";

// POST /api/payments - Simulate creating a Stripe session
export const createPayment = async (request: Request) => {
  const { companyId, userId, amount, currency } = await request.json();
  // Simulate creating a payment session
  const newPayment = {
    id: `pay-${Date.now()}`,
    companyId,
    userId,
    status: "pending" as PaymentStatus,
    amount,
    currency,
    stripeSessionId: `cs_test_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  db.payments.create(newPayment);
  // Return a mock Stripe URL
  return createSuccessResponse("OPERATION_SUCCESS", "payment", {
    ...newPayment,
    stripeUrl: `https://mock.stripe.com/session/${newPayment.stripeSessionId}`,
  });
};

// GET /api/payments/:id - Fetch payment status
export const getPayment = async (_request: Request, id: string) => {
  const payment = db.payments.findFirst({ where: { id } });
  if (!payment) {
    return createErrorResponse("NOT_FOUND", "Payment not found");
  }
  return createSuccessResponse("OPERATION_SUCCESS", "payment", payment);
};
