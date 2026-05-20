# Caching Lie Detector

Five statements about how caching works in **The Pulse** app:

1. The app uses React Query's stale‑while‑revalidate strategy to show cached data instantly while fetching fresh data in the background.  
2. The **Follow** button updates instantly thanks to optimistic UI updates, rolling back if the request fails.  
3. Hovering over a creator card triggers a prefetch of the creator’s detail data, storing it in the cache before navigation.  
4. Clicking **Refresh Feed** forces a fresh network request by invalidating the cached feed, then displays the new data.  
5. **All cached data is persisted to `localStorage`, so the cache survives a full page reload or browser restart.**

---

### Identify the Lie
The false statement is **#5**. The app **does not** persist its React Query cache to `localStorage` by default; the cache lives only in memory and is cleared on page reload. This means the UI must refetch data after a hard refresh.

---

### Answer
**Lie:** Statement #5.
**Why:** React Query stores cache entries in memory. To persist across sessions you would need to add a custom persistence plugin, which this project does not include.
