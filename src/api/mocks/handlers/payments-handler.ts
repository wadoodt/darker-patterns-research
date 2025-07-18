// src/api/mocks/handlers/payments-handler.ts
import { db } from '../db';

// POST /api/payments - Simulate creating a Stripe session
export const createPayment = async (request: Request) => {
  const { companyId, userId, amount, currency } = await request.json();
  // Simulate creating a payment session
  const newPayment = {
    id: `pay-${Date.now()}`,
    companyId,
    userId,
    status: 'pending',
    amount,
    currency,
    stripeSessionId: `cs_test_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  db.payments.create(newPayment);
  // Return a mock Stripe URL
  return new Response(
    JSON.stringify({
      payment: newPayment,
      stripeUrl: `https://mock.stripe.com/session/${newPayment.stripeSessionId}`
    }),
    { status: 201, headers: { 'Content-Type': 'application/json' } }
  );
};

// GET /api/payments/:id - Fetch payment status
export const getPayment = async (_request: Request, id: string) => {
  const payment = db.payments.findFirst({ where: { id } });
  if (!payment) {
    return new Response('Payment not found', { status: 404 });
  }
  return new Response(JSON.stringify(payment), { status: 200, headers: { 'Content-Type': 'application/json' } });
}; 