
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { Payment, CreatePaymentPayload } from "./types";

const getPayment = async (id: string): Promise<Payment> => {
  return handleQuery(() => apiClient.get(`/payments/${id}`));
};

const createPayment = async (payload: CreatePaymentPayload): Promise<Payment> => {
  return handleMutation(() => apiClient.post("/payments", payload));
};

export const payments = {
  getPayment,
  createPayment,
};
