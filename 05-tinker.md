# Tinker Experiment Documentation

## Network Conditions Tested

### 1️⃣ Slow 3G
- **Prediction**: Cached feed items appear instantly, loading spinners show while fresh data is fetched. Follow button updates instantly due to optimistic UI.
- **Actual Observation**: *[Insert actual behavior here once verified]*
- **Gap**: *[Describe any difference]*

### 2️⃣ Offline
- **Prediction**: Entire UI renders from cache; no network requests fire. Follow button updates instantly but then fails silently or shows an error toast.
- **Actual Observation**: *[Insert actual behavior here once verified]*
- **Gap**: *[Describe any difference]*

## Summary
The app’s caching strategy keeps the UI responsive even under very poor network conditions. When offline, the UI remains functional but any actions requiring a server round‑trip cannot be persisted.
