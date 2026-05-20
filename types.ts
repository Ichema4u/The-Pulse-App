export interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  recentPosts: number;
  isFollowing?: boolean;
}

export interface CreatorResponse {
  data: Creator[];
  timestamp: number;
}
