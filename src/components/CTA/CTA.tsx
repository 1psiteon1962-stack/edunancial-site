'use client';

import React from "react";

export default function CTA() {
  return (
    <section
      style={{
        padding: "60px 20px",
        textAlign: "center",
        background: "#f5f7fb",
        marginTop: "40px"
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2>Start Building Your Financial Future</h2>

        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            lineHeight: "1.6"
          }}
        >
          Edunancial helps individuals develop financial discipline,
          protect capital, and scale assets through structured education
          systems designed for long-term wealth creation.
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
            View Programs
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
            Learn About Edunancial
          </a>
        </div>
      </div>
    </section>
  );
}
