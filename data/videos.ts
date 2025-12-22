export type VideoItem = {
  id: string;
  title: string;
  description?: string;
};

export const videos: VideoItem[] = [
  {
    id: "1",
    title: "Getting Started",
    description: "Introduction to financial literacy"
  }
];
