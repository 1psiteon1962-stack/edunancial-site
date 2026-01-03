// instrumentation.ts
import { registerNetlifyForm } from "@netlify/next/forms";

export async function register() {
  registerNetlifyForm({
    name: "contact",
    path: "/start",
    honeypot: "bot-field",
  });

  registerNetlifyForm({
    name: "newsletter",
    path: "/",
    honeypot: "bot-field",
  });
}
