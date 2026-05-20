Mapping code to caching principles — plain definition + exact code lines

1. Single source of truth (server state)

- Definition: The server is the authoritative source of data; client cache is a local copy used for performance and UX.
- Exact code (where we fetch authoritative data):

  app/api/creators/route.ts

  ```ts
  // Simulate network delay of 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({
    data: mockCreators,
    timestamp: Date.now(),
  });
  ```

2. Stale-While-Revalidate (SWR)

- Definition: Serve cached data immediately (fast), then revalidate in background and update cache/UI when fresh data arrives.
- Exact code lines (query + staleTime):

  components/CreatorFeed.tsx

  ```ts
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => fetch("/api/creators"),
    staleTime: 1000 * 60 * 2, // Data is fresh for 2 minutes
    gcTime: 1000 * 60 * 5,
  });
  ```

3. Optimistic UI (optimistic updates)

- Definition: Update the UI immediately before the server confirms, keeping a snapshot to rollback on error.
- Exact code lines (mutation hooks):

  components/CreatorCard.tsx

  ```ts
  onMutate: async (newFollowingState: boolean) => {
    await queryClient.cancelQueries({ queryKey: ['creators'] });
    const previousData = queryClient.getQueryData(['creators']);
    queryClient.setQueryData(['creators'], (old: any) => ({
      ...old,
      data: old.data.map((c: Creator) => c.id === creator.id ? { ...c, isFollowing: newFollowingState } : c),
    }));
    return { previousData };
  },

  onError: (err, newFollowingState, context: any) => {
    if (context?.previousData) {
      queryClient.setQueryData(['creators'], context.previousData);
    }
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['creators'] });
  },
  ```

4. Cache invalidation (manual)

- Definition: Explicitly marking cached entries stale so the system fetches authoritative data again.
- Exact code:

  components/CreatorFeed.tsx

  ```ts
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ["creators"] });
    await refetch();
  };
  ```

5. Prefetching

- Definition: Proactively fetching data the user might need soon, storing it in cache for instant access.
- Exact code:

  components/CreatorFeed.tsx

  ```ts
  queryClient.prefetchQuery({
    queryKey: ["creator", creatorId],
    queryFn: async () => fetch(`/api/creators?id=${creatorId}`),
    staleTime: 1000 * 60,
  });
  ```

6. Background refetch on focus

- Definition: When the user focuses the window, automatically revalidate stale queries.
- Exact code (global):

  lib/queryClient.ts

  ```ts
  const queryConfig: DefaultOptions = {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  };
  ```

7. Notes on `staleTime` vs `gcTime` (cacheTime)

- Definition: `staleTime` is how long data is considered fresh (no background refetch on mount); `gcTime` (formerly `cacheTime`) is how long unused data remains in memory before being garbage-collected.
- Exact code:

  lib/queryClient.ts

  ```ts
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
  ```

Each principle in the app is intentionally visible in code: query keys are explicit, optimistic logic keeps a snapshot to roll back, prefetching uses `prefetchQuery`, manual invalidation uses `invalidateQueries`, and background refetch is enabled globally.
