"use client";

import { useEffect } from "react";

const SCRIPT_PLACEHOLDER =
  "Paste the narration script in the language you want spoken.";

function controls() {
  const textarea = Array.from(document.querySelectorAll("textarea")).find(
    (node) => node.getAttribute("placeholder") === SCRIPT_PLACEHOLDER,
  );
  const buttons = Array.from(document.querySelectorAll("button"));
  const generate = buttons.find((button) => {
    const text = button.textContent?.trim() ?? "";
    return text === "Generate narration" || text === "Generating…";
  });
  return { textarea, generate };
}

function narrationReady(textarea: Element | undefined) {
  if (!textarea) return false;
  const panel = textarea.closest("div.rounded-2xl");
  return Boolean(panel?.querySelector("audio"));
}

export default function AutoNarrationBridge() {
  useEffect(() => {
    let debounce: number | undefined;

    const requestNarration = () => {
      const { textarea, generate } = controls();
      if (!(textarea instanceof HTMLTextAreaElement)) return false;
      if (!textarea.value.trim() || narrationReady(textarea)) return false;
      if (!(generate instanceof HTMLButtonElement) || generate.disabled) return false;
      generate.click();
      return true;
    };

    const onInput = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLTextAreaElement)) return;
      if (target.getAttribute("placeholder") !== SCRIPT_PLACEHOLDER) return;
      window.clearTimeout(debounce);
      debounce = window.setTimeout(requestNarration, 600);
    };

    // AI narration generation is opportunistic only. Rendering must never be
    // intercepted or blocked here: microphone narration and silent renders are
    // valid even when OPENAI_API_KEY is not configured.
    document.addEventListener("input", onInput, true);
    return () => {
      window.clearTimeout(debounce);
      document.removeEventListener("input", onInput, true);
    };
  }, []);

  return null;
}
