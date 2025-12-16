function readcookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export function getruntimelang(): "en" | "es" {
  if (typeof window === "undefined") return "en";

  const path = window.location.pathname.toLowerCase();
  const first = path.split("/").filter(Boolean)[0];
  if (first === "en" || first === "es") return first;

  const c = readcookie("lang");
  if (c === "en" || c === "es") return c;

  return "en";
}

export function getruntimesitekey(): string {
  if (typeof window === "undefined") return "us-main";

  const host = window.location.hostname.toLowerCase();

  if (host.includes("latam")) return "latam";
  if (host.includes("africa")) return "africa";
  if (host.includes("europe")) return "europe";
  if (host.includes("asia")) return "asia";
  if (host.includes("caribbean")) return "caribbean";

  return "us-main";
}
