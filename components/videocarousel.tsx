"use client";

import { useState, useEffect } from "react";

const sampleVideos = [
  "/videos/sample1.mp4",
  "/videos/sample2.mp4",
  "/videos/sample3.mp4",
];

export default function VideoCarousel() {
  const [index, setIndex] = useState(0);

  // Rotate every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sampleVideos.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <video
          key={index}
          src={sampleVideos[index]}
          className="w-full h-auto"
          autoPlay
          muted
          loop
        />
      </div>

      <p className="text-center mt-4 text-slate-300 text-sm">
        *Replace these placeholder videos at any time without changing code.*
      </p>
    </div>
  );
}
