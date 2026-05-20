Audit: race conditions, stale-on-logout, memory, over-fetching, and failed mutations

1. Rapid clicks / race conditions when user taps Follow repeatedly

- What happens in this code: `CreatorCard.tsx` uses `useMutation` and the UI disables the button while `isPending` is true (`disabled={isPending}`) which prevents rapid double-submits in the common case.
- Risk: If the button were not disabled, each click triggers `onMutate` and a network request. Multiple overlapping mutations can create conflicting optimistic snapshots and out-of-order server confirmations.
- Mitigations:
  - Keep the UI disabled while a mutation is pending (already implemented).
  - Use a mutation queue or serialize operations server-side (last write wins or versioned updates).
  - Include idempotency or a desired target state in the request instead of a toggle.

2. Stale data after user logs out

- Problem: cached data like `['creators']` remains in memory after logout, and a new user could briefly see previous user's data.
- Where: cached queries live until `gcTime` elapses (lib/queryClient.ts). If you want a clean slate on logout, you must clear or reset the cache explicitly.
- Mitigations:
  - On logout, call `queryClient.clear()` or `queryClient.removeQueries()` to remove sensitive data.
  - Optionally set short `gcTime` for sensitive queries.

3. Memory leaks from unbounded cache growth

- Problem: React Query keeps cached results for each unique query key. If the app creates many unique keys (e.g., `['creator', id]` for thousands of ids) and `gcTime` is long, memory increases.
- Mitigations:
  - Reduce `gcTime` (shorter lifetime) for non-critical queries.
  - Limit prefetching to a small set of probable targets.
  - Use `queryClient.removeQueries()` for keys you know are no longer needed.
  - Avoid creating unbounded unique keys in list render loops.

4. Over-fetching when the app remounts

- Problem: By default React Query may refetch when components mount if data is stale; many mounts/unmounts can cause repeated requests.
- Where: `refetchOnMount`, `staleTime` control this behavior (CreatorFeed sets a `staleTime` to keep data fresh for 2 minutes).
- Mitigations:
  - Increase `staleTime` to avoid refetch on frequent remounts.
  - Set `refetchOnMount: false` for queries where background freshness is not critical.

5. Network failure mid-mutation (what users see)

- Behavior in this code: optimistic update writes to cache immediately; if the POST fails, `onError` restores the cached snapshot. The user will see the button flip immediately then revert on error (with `Updating...` shown while the request is in flight).
- Mitigations / UX improvements:
  - Show a transient error message when rollback occurs so the user understands why the change failed.
  - Retry strategies: keep retry limited (queryClient default `retry: 1`), or provide an explicit retry button.

6. Practical checklist for hardening this app

- Disable repeat actions while mutation is pending (done).
- Clear sensitive caches on logout (`queryClient.clear()`).
- Pick reasonable `staleTime` / `gcTime` values per query type.
- Limit aggressive prefetching to avoid unbounded keys.
- Add user-visible error feedback on mutation failures.

References (where to look in code):

- optimistic + rollback: `components/CreatorCard.tsx` (`onMutate` / `onError` / `onSuccess`).
- stale vs cache lifetime: `components/CreatorFeed.tsx` and `lib/queryClient.ts` (`staleTime`, `gcTime`).
- prefetch: `components/CreatorFeed.tsx` (`queryClient.prefetchQuery`).
