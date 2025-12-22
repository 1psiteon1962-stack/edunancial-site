export type VideoItem = {
  id: string;
  title: string;
  description?: string;
  url: string;
};

export const videos: VideoItem[] = [
  {
    id: "intro",
    title: "What is Edunancial?",
    description: "An overview of the Edunancial platform.",
    url: "https://www.youtube.com"
  },
  {
    id: "basics",
    title: "Financial Basics",
    description: "Understanding money, credit, and structure.",
    url: "https://www.youtube.com"
  }
];
