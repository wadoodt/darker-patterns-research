import { useMemo } from "react";
import { CacheContext } from "./context";
import type { CacheContextValue, CacheProviderProps } from "./types";
import { useCacheInitialization } from "./useCacheInitialization";
import { useCacheAPI } from "./useCacheAPI";

export function CacheProvider({
  children,
  dbName = "AppCacheDB",
  cleanupIntervalMs = 1000 * 60 * 10,
}: CacheProviderProps) {
  const { kvRef, isReady, error } = useCacheInitialization({
    dbName,
    cleanupIntervalMs,
  });





  const cacheAPI = useCacheAPI(kvRef);

  const contextValue: CacheContextValue = useMemo(
    () => ({
      isReady,
      error,
      db: kvRef.current,
      ...cacheAPI,
    }),
    [isReady, error, kvRef, cacheAPI],
  );

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}
