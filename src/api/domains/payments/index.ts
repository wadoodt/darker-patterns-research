
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { Payment, CreatePaymentPayload } from "./types";

/**
 * Fetches a payment by its ID.
 * @param {string} id - The ID of the payment to fetch.
 * @returns {Promise<Payment>} A promise that resolves with the payment data.
 */
const getPayment = (id: string): Promise<Payment> => {
  return handleQuery<Payment>(`/payments/${id}`);
};

/**
 * Creates a new payment.
 * @param {CreatePaymentPayload} payload - The payment data to create.
 * @returns {Promise<Payment>} A promise that resolves with the newly created payment.
 */
const createPayment = (payload: CreatePaymentPayload): Promise<Payment> => {
  return handleMutation.post("/payments", payload);
};

export const payments = {
  getPayment,
  createPayment,
};
