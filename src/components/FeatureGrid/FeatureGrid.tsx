'use client';

import React from "react";

type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: "Financial Discipline",
    description:
      "Learn the foundational habits required to build and protect capital over time."
  },
  {
    title: "Asset Strategy",
    description:
      "Understand how different asset classes work and how disciplined investors allocate capital."
  },
  {
    title: "Wealth Scaling",
    description:
      "Move from income dependency toward scalable financial structures and asset growth."
  },
  {
    title: "Global Perspective",
    description:
      "Explore financial systems, economic realities, and opportunities across international markets."
  }
];

export default function FeatureGrid() {
  return (
    <section
      style={{
        padding: "60px 20px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
        Edunancial Learning Framework
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "30px"
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "20px",
              background: "#ffffff"
            }}
          >
            <h3>{feature.title}</h3>
            <p style={{ marginTop: "10px", lineHeight: "1.5" }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
