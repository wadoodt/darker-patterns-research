// src/api/mocks/_data/payments-data.ts

export const mockPayments = [
  {
    id: 'pay-001',
    companyId: 'comp-001',
    userId: 'user-001',
    status: 'completed', // or 'pending', 'failed'
    amount: 9900,
    currency: 'usd',
    stripeSessionId: 'cs_test_123',
    createdAt: '2024-06-01T12:00:00Z'
  },
  // Add more mock payments as needed
]; 