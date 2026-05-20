<!-- Copilot workspace customization for The Pulse project -->

## Project Overview
The Pulse is a Next.js 15 dashboard demonstrating advanced React Query caching patterns including stale-while-revalidate, optimistic updates, manual cache invalidation, prefetching, and background refetch.

## Key Technologies
- Next.js 15 (App Router)
- TypeScript
- React Query (TanStack Query)
- Tailwind CSS

## Project Structure
- `app/` - Next.js App Router pages and layouts
- `app/api/` - API routes with 1-second mock delay
- `components/` - React components (CreatorCard, CreatorFeed)
- `lib/` - Utilities and configuration (queryClient, types, mockData)

## Important Files
- `lib/queryClient.ts` - React Query configuration for caching behavior
- `app/api/creators/route.ts` - Mock API endpoint
- `components/CreatorFeed.tsx` - Main dashboard component
- `components/CreatorCard.tsx` - Creator card with optimistic updates
- `tailwind.config.ts` - Calm color palette configuration

## Development Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Testing the Caching Features
1. **Stale-while-revalidate**: Page loads with cached data, fresh data updates in background
2. **Optimistic updates**: Click Follow - UI updates instantly, rolls back on error
3. **Refresh**: Click Refresh Feed button to invalidate cache and fetch new data
4. **Prefetch on hover**: Hover over cards to see prefetching indicator
5. **Background refetch**: Switch tabs and return to trigger automatic refetch

## Notes
- API has a 1-second artificial delay to simulate real network conditions
- Mock creator data is in `lib/mockData.ts`
- Color palette uses sage, slate, and stone for a calm aesthetic
