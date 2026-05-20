"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatorCard } from "./CreatorCard";
import type { CreatorResponse } from "@/lib/types";

export function CreatorFeed() {
  const queryClient = useQueryClient();

  // Fetch creators with stale-while-revalidate behavior
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const response = await fetch("/api/creators");
      if (!response.ok) throw new Error("Failed to fetch creators");
      return response.json() as Promise<CreatorResponse>;
    },
    staleTime: 1000 * 60 * 2, // Data is fresh for 2 minutes
    gcTime: 1000 * 60 * 5, // Keep data for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Prefetch handler on hover
  const handleCreatorHover = (creatorId: string) => {
    // Simulate prefetching detail data
    queryClient.prefetchQuery({
      queryKey: ["creator", creatorId],
      queryFn: async () => {
        const response = await fetch(`/api/creators?id=${creatorId}`);
        if (!response.ok) throw new Error("Failed to fetch creator details");
        return response.json();
      },
      staleTime: 1000 * 60,
    });
  };

  // Manual refresh handler
  const handleRefresh = async () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["creators"] });
    await refetch();
  };

  return (
    <div className="w-full">
      {/* Header with refresh button and status */}
      <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-gradient-to-b from-white via-white to-white/80 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-stone-900">The Pulse</h1>
          <p className="text-slate-600 mt-1">Trending creators in real-time</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isFetching && !isLoading && (
              <>
                <span className="inline-block w-2 h-2 bg-sage-600 rounded-full animate-pulse" />
                <span className="text-slate-600">Updating...</span>
              </>
            )}
            {isLoading && (
              <>
                <span className="inline-block w-2 h-2 bg-stone-400 rounded-full animate-pulse" />
                <span className="text-slate-600">Loading...</span>
              </>
            )}
            {!isFetching && !isLoading && (
              <>
                <span className="inline-block w-2 h-2 bg-sage-600 rounded-full" />
                <span className="text-slate-600">Up to date</span>
              </>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
              border border-sage-300 bg-white hover:bg-sage-50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isFetching ? "animate-spin" : ""}
            `}
          >
            {isFetching ? "↻" : "↻ Refresh Feed"}
          </button>
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          Failed to load creators. Please try again.
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onHover={handleCreatorHover}
            />
          ))}
        </div>
      )}

      {isLoading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gradient-to-br from-sage-100 to-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Info about caching */}
      <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-stone-900 mb-2">
          ✨ Caching Features
        </h3>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>
            <strong>Stale-while-revalidate:</strong> Cached data shows
            instantly, fresh data loads in background
          </li>
          <li>
            <strong>Optimistic updates:</strong> Follow/unfollow updates show
            immediately with automatic rollback on error
          </li>
          <li>
            <strong>Manual refresh:</strong> Use the Refresh Feed button to
            invalidate cache and fetch latest data
          </li>
          <li>
            <strong>Prefetching on hover:</strong> Hovering a card preloads its
            detail data (watch the indicator)
          </li>
          <li>
            <strong>Background refetch:</strong> When you switch tabs and
            return, fresh data will automatically load
          </li>
        </ul>
      </div>
    </div>
  );
}
