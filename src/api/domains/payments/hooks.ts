
import { useAsyncCache } from "@hooks/useAsyncCache";
import { payments } from "./index";
import type { CreatePaymentPayload } from "./types";

export const useCreatePayment = () => {
  const { refresh } = useAsyncCache(["payments"], () => Promise.resolve(null));
  
  return {
    mutate: async (payload: CreatePaymentPayload) => {
      const result = await payments.createPayment(payload);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const usePayment = (paymentId: string) => {
  return useAsyncCache(
    ["payments", paymentId],
    () => payments.getPayment(paymentId),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};
