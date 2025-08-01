
import { useAsyncCache } from "@hooks/useAsyncCache";
import { companies } from "./index";

export const useCompanies = () => {
  return useAsyncCache(
    ["companies"],
    () => companies.getCompanies(),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
}; 