import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: true, // Enable background refetch on window focus
    refetchOnReconnect: true,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
