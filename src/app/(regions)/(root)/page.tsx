import React from "react";

/**
 * 🚨 FINAL FIX:
 * DO NOT execute anything at import time
 * DO NOT call functions outside the component
 * DO NOT destructure unknown data
 */

function HomePage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Edunancial</h1>
      <p>Site is live.</p>
    </main>
  );
}

/**
 * ✅ CRITICAL:
 * EXPORT A FUNCTION — NOT THE RESULT OF A FUNCTION CALL
 */
export default function RootPage() {
  return <HomePage />;
}
