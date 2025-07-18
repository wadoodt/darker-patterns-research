import { useContext } from "react";
import { CacheContext } from "./context";
import type { CacheContextValue } from "./types";

/**
 * Custom hook to access the raw cache context.
 * Useful for direct operations like invalidation.
 */
export function useCache(): CacheContextValue {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error("useCache must be used within a CacheProvider");
  }
  return context;
}
