
import { useAsyncCache } from "@hooks/useAsyncCache";
import { payments } from "./index";
import type { CreatePaymentPayload } from "./types";
import { cacheKeys } from "@api/cacheKeys";
import { useCache } from "@contexts/CacheContext";

const PAYMENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useCreatePayment = () => {
  const { invalidateCacheKeys } = useCache();
  
  return {
    mutate: async (payload: CreatePaymentPayload) => {
      const result = await payments.createPayment(payload);
      // Invalidate all payments-related queries
      await invalidateCacheKeys(cacheKeys.payments.allPrefix);
      return result;
    },
  };
};

export const usePayment = (paymentId: string) => {
  return useAsyncCache(
    cacheKeys.payments.one(paymentId),
    () => payments.getPayment(paymentId),
    { ttl: PAYMENT_CACHE_TTL }
  );
};
