'use client';

import React, { useState, useEffect } from "react";

interface Slide {
  id: number;
  title: string;
  description: string;
  image?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Financial Literacy",
    description:
      "Learn the fundamentals of money, investing, and entrepreneurship."
  },
  {
    id: 2,
    title: "Global Entrepreneurship",
    description:
      "Understand how business systems work across continents and cultures."
  },
  {
    id: 3,
    title: "Wealth Building",
    description:
      "Develop disciplined strategies for building and protecting wealth."
  }
];

export default function ClientSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section style={{ width: "100%", padding: "40px 20px", textAlign: "center" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "12px",
          padding: "40px",
          background: "#111",
          color: "#fff"
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>
          {slide.title}
        </h2>

        <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
          {slide.description}
        </p>

        <div style={{ marginTop: "20px" }}>
          {slides.map((s, i) => (
            <span
              key={s.id}
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                margin: "0 5px",
                background: i === current ? "#fff" : "#555"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
