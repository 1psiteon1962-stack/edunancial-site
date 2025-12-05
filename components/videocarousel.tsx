// components/VideoCarousel.tsx
"use client";

import { useEffect, useState } from "react";

const videos = [
  "/videos/preview1.mp4",
  "/videos/preview2.mp4",
  "/videos/preview3.mp4",
];

export default function VideoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (videos.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % videos.length);
    }, 15000); // 15 seconds per video

    return () => clearInterval(timer);
  }, []);

  if (!videos.length) return null;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black">
      <video
        key={index}
        src={videos[index]}
        autoPlay
        muted
        loop={false}
        controls={false}
        className="w-full h-full"
      />
    </div>
  );
}
