# The Pulse - Advanced Caching Patterns Demo

A modern Next.js 15 dashboard showcasing trending creators with advanced data fetching and caching patterns. Built with TypeScript, React Query (TanStack Query), and Tailwind CSS.

## ✨ Features

### Caching Patterns Demonstrated

1. **Stale-While-Revalidate (SWR)**
   - Cached data displays instantly
   - Fresh data fetches in the background
   - Users see up-to-date content without waiting

2. **Optimistic Updates**
   - Follow/unfollow buttons update immediately
   - Automatic rollback if the request fails
   - Seamless user experience

3. **Manual Cache Invalidation**
   - "Refresh Feed" button to force a fresh fetch
   - Invalidates the cache and triggers a new request
   - Clear visual feedback during refresh

4. **Prefetching on Hover**
   - Hovering over a creator card preloads detail data
   - Visual indicator shows prefetching in progress
   - Reduces perceived latency

5. **Background Refetch on Window Focus**
   - When you switch tabs and return, data automatically refetches
   - Ensures users always see the latest trending creators
   - Configured in React Query settings

### UI/UX

- **Calm Color Palette**: Sage, slate, and stone colors for a soothing interface
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Status**: Visual indicators show loading and fetching states
- **Smooth Animations**: Transitions and hover effects enhance interactivity

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes

## 📋 Project Structure

```
The Pulse/
├── app/
│   ├── api/
│   │   └── creators/
│   │       └── route.ts          # API endpoint for creators data
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main dashboard page
│   ├── globals.css               # Global styles
│   └── providers.tsx             # React Query provider
├── components/
│   ├── CreatorCard.tsx           # Individual creator card component
│   └── CreatorFeed.tsx           # Main feed component
├── lib/
│   ├── queryClient.ts            # React Query client configuration
│   ├── types.ts                  # TypeScript types
│   └── mockData.ts               # Mock creator data
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 How to Use

### Viewing the Dashboard

- The feed loads with stale-while-revalidate behavior
- See the status indicator change as data loads

### Testing Optimistic Updates

- Click "Follow" on any creator card
- Notice the button updates immediately
- The update completes with a network request (watch for "Updating...")

### Manual Cache Refresh

- Click the "Refresh Feed" button
- Observe fresh data loading while showing cached data
- Notice the status indicator

### Prefetching

- Hover over a creator card
- Watch for the "Prefetching..." indicator
- Detail data loads in the background

### Background Refetch

- Click to another browser tab
- Wait a few seconds, then return
- Watch fresh data load automatically

## 🔧 Configuration

### React Query Settings

Edit `lib/queryClient.ts` to adjust:

- `staleTime`: How long data stays fresh
- `gcTime`: How long to keep unused data
- `refetchOnWindowFocus`: Auto-refetch on tab return
- `refetchOnReconnect`: Auto-refetch when connection returns

### API Delay

Edit `app/api/creators/route.ts` to change the simulated network delay (currently 1 second).

## 🎨 Color Palette

The app uses a calm color palette:

- **Sage**: Soft greens for primary actions
- **Slate**: Muted grays for secondary elements
- **Stone**: Warm neutrals for text

Customize in `tailwind.config.ts`.

## 📦 Build & Deployment

Build the project:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## 🧪 Development Tools

- React Query DevTools: Open to inspect queries and mutations
- Browser DevTools: Monitor network requests
- Console: Watch for React Query lifecycle logs

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 License

MIT
