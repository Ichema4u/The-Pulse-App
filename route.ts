import { NextResponse } from "next/server";
import { mockCreators } from "@/lib/mockData";
import type { CreatorResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<CreatorResponse>> {
  // Simulate network delay of 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({
    data: mockCreators,
    timestamp: Date.now(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { creatorId, isFollowing } = body;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Find the creator and update their following status
  const creator = mockCreators.find((c) => c.id === creatorId);
  if (creator) {
    creator.isFollowing = isFollowing;
  }

  return NextResponse.json({
    success: true,
    creator,
  });
}
