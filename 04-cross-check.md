# Race Conditions and Rollback Edge Cases

## Overview
The Pulse uses **optimistic updates** for the Follow/Unfollow button. The UI is updated immediately, and a background request is sent to the server. If the request fails, the UI must roll back to its previous state.

## Potential Race Conditions
1. **Rapid Clicks** – Users may click the Follow button multiple times before the first request resolves. The client must serialize mutations or cancel pending ones to avoid out‑of‑order state.
2. **Concurrent Mutations from Different Tabs** – When the same user has the app open in two tabs, each tab can issue a Follow request for the same creator. Without proper query invalidation, one tab may show a stale state after the other's request succeeds.
3. **Prefetch Overwrites** – Prefetching detailed data while a mutation is in‑flight can cause the cache to be refreshed with stale data, potentially reverting the optimistic UI.

## Rollback Edge Cases
- **Network Failure After UI Update** – The request fails (e.g., offline, 5xx). The client must revert the button text/icon and optionally show an error toast.
- **Server Returns Unexpected Payload** – If the server responds with an error code but still sends a payload, the client might incorrectly keep the optimistic state.
- **Cache Invalidation Timing** – The query is invalidated before the mutation resolves, causing a refetch that overwrites the optimistic change.

## Mitigations Implemented
- **`useMutation` with `onMutate`, `onError`, `onSettled`** handlers to store previous state and roll back on error.
- **`mutation.isLoading` flag** disables the button while a request is in flight, preventing rapid repeat clicks.
- **Query key scoping** ensures that only the specific creator’s cache entry is updated, leaving other cached data untouched.
- **Automatic refetch on window focus/reconnect** re‑validates data after a connectivity change, fixing any missed rollbacks.

## Remaining Gaps
- No debounce on click events – extremely fast double‑clicks could still cause overlapping mutations.
- Cross‑tab synchronization relies on React Query’s broadcast channel which may be disabled in some browsers.

---
*Document generated on 2026‑05‑20.*
