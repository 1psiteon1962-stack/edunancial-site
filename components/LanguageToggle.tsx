"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(lang: "en" | "es") {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "en" || segments[0] === "es") {
      segments[0] = lang;
    } else {
      segments.unshift(lang);
    }
    router.push("/" + segments.join("/"));
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button onClick={() => switchTo("en")}>English</button>
      <button onClick={() => switchTo("es")}>Español</button>
    </div>
  );
}
