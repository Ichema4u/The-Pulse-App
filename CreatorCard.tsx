"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Creator } from "@/lib/types";

interface CreatorCardProps {
  creator: Creator;
  onHover?: (creatorId: string) => void;
}

export function CreatorCard({ creator, onHover }: CreatorCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const queryClient = useQueryClient();

  // Mutation for following/unfollowing
  const { mutate: toggleFollow, isPending } = useMutation({
    mutationFn: async (newFollowingState: boolean) => {
      const response = await fetch("/api/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: creator.id,
          isFollowing: newFollowingState,
        }),
      });
      if (!response.ok) throw new Error("Failed to update follow status");
      return response.json();
    },
    // Optimistic update
    onMutate: async (newFollowingState: boolean) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["creators"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["creators"]);

      // Optimistically update to the new value
      if (previousData) {
        queryClient.setQueryData(["creators"], (old: any) => ({
          ...old,
          data: old.data.map((c: Creator) =>
            c.id === creator.id ? { ...c, isFollowing: newFollowingState } : c,
          ),
        }));
      }

      return { previousData };
    },
    // Rollback on error
    onError: (err, newFollowingState, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["creators"], context.previousData);
      }
    },
    // Invalidate query on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    },
  });

  const handleHover = () => {
    setIsHovering(true);
    onHover?.(creator.id);
  };

  const handleToggleFollow = () => {
    toggleFollow(!creator.isFollowing);
  };

  return (
    <div
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        group relative rounded-2xl transition-all duration-300
        border border-sage-200 bg-gradient-to-br from-white to-sage-50
        hover:border-sage-300 hover:shadow-lg
        overflow-hidden
      `}
    >
      {/* Background gradient on hover */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br from-sage-100/50 to-slate-100/50
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}
      />

      {/* Card content */}
      <div className="relative p-6 z-10">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl bg-sage-200/50 rounded-full p-3 group-hover:bg-sage-300/50 transition-colors">
            {creator.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-900">
              {creator.name}
            </h3>
            <p className="text-sm text-slate-600">Trending Creator</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-sage-200">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Followers
            </p>
            <p className="text-xl font-semibold text-stone-800">
              {(creator.followers / 1000).toFixed(1)}k
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Recent Posts
            </p>
            <p className="text-xl font-semibold text-stone-800">
              {creator.recentPosts}
            </p>
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleToggleFollow}
          disabled={isPending}
          className={`
            w-full py-2.5 px-4 rounded-xl font-medium text-sm
            transition-all duration-200 disabled:opacity-50
            ${
              creator.isFollowing
                ? "bg-sage-200 text-sage-900 hover:bg-sage-300"
                : "bg-sage-600 text-white hover:bg-sage-700"
            }
          `}
        >
          {isPending
            ? "Updating..."
            : creator.isFollowing
              ? "Following"
              : "Follow"}
        </button>

        {/* Hover indicator */}
        {isHovering && (
          <div className="absolute top-2 right-2 text-xs bg-sage-600 text-white px-2 py-1 rounded">
            Prefetching...
          </div>
        )}
      </div>
    </div>
  );
}
