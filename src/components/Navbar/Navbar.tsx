'use client';

import React from "react";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "20px" }}>
          Edunancial
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center"
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "#1f2937"
            }}
          >
            Home
          </a>

          <a
            href="/products"
            style={{
              textDecoration: "none",
              color: "#1f2937"
            }}
          >
            Programs
          </a>

          <a
            href="/resources"
            style={{
              textDecoration: "none",
              color: "#1f2937"
            }}
          >
            Resources
          </a>

          <a
            href="/about"
            style={{
              textDecoration: "none",
              color: "#1f2937"
            }}
          >
            About
          </a>

          <a
            href="/login"
            style={{
              padding: "8px 16px",
              background: "#1f3c88",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "6px"
            }}
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}
