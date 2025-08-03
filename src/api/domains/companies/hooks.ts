
import { useAsyncCache } from "@hooks/useAsyncCache";
import { companies } from "./index";
import { cacheKeys } from "@api/cacheKeys";

const COMPANIES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useCompanies = ({ page = 1, limit = 10 }) => {
  return useAsyncCache(
    cacheKeys.companies.all(page, limit),
    () => companies.getCompanies({ page, limit }),
    { ttl: COMPANIES_CACHE_TTL }
  );
}; 