"use client";

import React from "react";
import Link from "next/link";

type AccessGateProps = {
  levelRequired: string;
  userLevel?: string;
  children: React.ReactNode;
};

export default function AccessGate({
  levelRequired,
  userLevel,
  children,
}: AccessGateProps) {
  // If user level is missing or too low, block access
  if (!userLevel || userLevel !== levelRequired) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: "40px auto",
          padding: 24,
          border: "1px solid #ddd",
          borderRadius: 12,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>
          🔒 Locked Content
        </h2>

        <p style={{ marginBottom: 16 }}>
          This page requires access to <strong>{levelRequired}</strong>.
        </p>

        <p style={{ marginBottom: 24 }}>
          Upgrade your membership to unlock this level.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: 8,
            background: "black",
            color: "white",
            textDecoration: "none",
          }}
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Otherwise show protected content
  return <>{children}</>;
}
