'use client';

import React from "react";

export default function Hero() {
  return (
    <section
      style={{
        padding: "60px 20px",
        textAlign: "center",
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      <h1>Edunancial</h1>

      <h2 style={{ marginTop: "20px" }}>
        Where Education and Financial Literacy Meet
      </h2>

      <p style={{ marginTop: "20px", fontSize: "18px", lineHeight: "1.6" }}>
        Edunancial is a global financial education platform designed to help
        individuals build discipline, protect capital, and scale assets through
        structured learning systems.
      </p>

      <div style={{ marginTop: "30px" }}>
        <a
          href="/products"
          style={{
            padding: "12px 24px",
            background: "#1f3c88",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "6px",
            marginRight: "10px"
          }}
        >
          Explore Programs
        </a>

        <a
          href="/about"
          style={{
            padding: "12px 24px",
            border: "2px solid #1f3c88",
            color: "#1f3c88",
            textDecoration: "none",
            borderRadius: "6px"
          }}
        >
          Learn More
        </a>
      </div>
    </section>
  );
}
