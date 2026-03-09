'use client';

import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "60px",
        padding: "40px 20px",
        background: "#0f172a",
        color: "#ffffff"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "30px"
        }}
      >
        <div>
          <h3>Edunancial</h3>
          <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
            Where Education and Financial Literacy Meet.  
            A global platform focused on building disciplined investors
            and financially independent individuals.
          </p>
        </div>

        <div>
          <h4>Platform</h4>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
            <li><a href="/products" style={{ color: "#ffffff", textDecoration: "none" }}>Programs</a></li>
            <li><a href="/courses" style={{ color: "#ffffff", textDecoration: "none" }}>Courses</a></li>
            <li><a href="/resources" style={{ color: "#ffffff", textDecoration: "none" }}>Resources</a></li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
            <li><a href="/about" style={{ color: "#ffffff", textDecoration: "none" }}>About</a></li>
            <li><a href="/contact" style={{ color: "#ffffff", textDecoration: "none" }}>Contact</a></li>
            <li><a href="/legal" style={{ color: "#ffffff", textDecoration: "none" }}>Legal</a></li>
          </ul>
        </div>

        <div>
          <h4>Global Education</h4>
          <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
            Edunancial provides structured financial education for individuals,
            entrepreneurs, and future investors across the world.
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "14px",
          opacity: 0.8
        }}
      >
        © {new Date().getFullYear()} Edunancial. All rights reserved.
      </div>
    </footer>
  );
}
