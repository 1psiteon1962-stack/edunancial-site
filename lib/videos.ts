// lib/videos.ts

export type VideoItem = {
  id: string;
  title: string;
  description?: string; // ✅ FIX: optional but supported
  url: string;
  duration?: string;
  thumbnail?: string;
  level?: 1 | 2 | 3 | 4 | 5;
  published?: boolean;
};

export const videos: VideoItem[] = [
  {
    id: "intro-business",
    title: "Introduction to Business Formation",
    description: "What every beginner must understand before forming an LLC or corporation.",
    url: "https://example.com/video1",
    level: 1,
    published: true,
  },
  {
    id: "llc-vs-corp",
    title: "LLC vs Corporation Explained",
    description: "A clear comparison of LLCs and corporations for new entrepreneurs.",
    url: "https://example.com/video2",
    level: 1,
    published: true,
  },
];
