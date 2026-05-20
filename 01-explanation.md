ELI7: The Pulse — Line-by-line simple explanation

1. Page mounts and the feed asks for creators.

- Where: `components/CreatorFeed.tsx` uses `useQuery({ queryKey: ['creators'], ... })`.
- ELI7: The app looks in its storage (cache) for a list called "creators" and shows it right away if present.

2. If cache is old, fetch fresh data in background (SWR).

- Where: `staleTime` is set on the query and in `lib/queryClient.ts` defaults.
- ELI7: Even if the stored list is a little old, the app still shows it and quietly asks the server for an update.

3. Server reply arrives after ~1s.

- Where: `app/api/creators/route.ts` includes a `setTimeout(..., 1000)` to simulate delay.
- ELI7: The server waits one second, then returns a fresh list; when it arrives the UI replaces the shown list.

4. Hovering a card preloads details.

- Where: `queryClient.prefetchQuery({ queryKey: ['creator', creatorId], ... })` in `components/CreatorFeed.tsx`.
- ELI7: When you move the mouse over a card the app quietly downloads more info for that person so opening their detail feels instant.

5. Click Follow — optimistic update happens.

- Where: `components/CreatorCard.tsx` `useMutation` with `onMutate`, `onError`, `onSuccess`.
- ELI7, step-by-step:
  a) The app saves a quick snapshot of the current list (so it can undo later).
  b) It immediately flips the Follow button in the cache so you see the change right away.
  c) It sends the Follow request to the server.
  d) If the server says "no" (error), the app restores the saved snapshot to undo the change.
  e) If the server says "ok", the app asks the server for the authoritative list again.

6. Manual Refresh.

- Where: `queryClient.invalidateQueries({ queryKey: ['creators'] })` in `components/CreatorFeed.tsx`.
- ELI7: Clicking Refresh tells the app to forget the cached list and fetch a new one from the server.

7. Background refetch on focus.

- Where: `refetchOnWindowFocus: true` in `lib/queryClient.ts` defaults.
- ELI7: Switching back to the browser tab makes the app quietly re-check the server so you see up-to-date trends.

Bottom line for humans:

- Query keys are the labels for cached items, like names on boxes.
- Stale-while-revalidate shows what's in the box immediately and then fetches a fresh box behind the scenes.
- Optimistic updates briefly trust the user and then confirm with the server, rolling back on disagreement.
