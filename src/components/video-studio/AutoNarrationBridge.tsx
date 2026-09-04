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
  const render = buttons.find((button) =>
    (button.textContent?.trim() ?? "").startsWith("Render "),
  );
  return { textarea, generate, render };
}

function narrationReady(textarea: Element | undefined) {
  if (!textarea) return false;
  const panel = textarea.closest("div.rounded-2xl");
  return Boolean(panel?.querySelector("audio"));
}

export default function AutoNarrationBridge() {
  useEffect(() => {
    let debounce: number | undefined;
    let replayingRender = false;

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

    const onClick = (event: MouseEvent) => {
      if (replayingRender) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const clicked = target.closest("button");
      const { textarea, render } = controls();
      if (!(clicked instanceof HTMLButtonElement) || clicked !== render) return;
      if (!(textarea instanceof HTMLTextAreaElement) || !textarea.value.trim()) return;
      if (narrationReady(textarea)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      requestNarration();

      const started = Date.now();
      const wait = window.setInterval(() => {
        const current = controls();
        if (narrationReady(current.textarea)) {
          window.clearInterval(wait);
          if (current.render instanceof HTMLButtonElement) {
            replayingRender = true;
            current.render.click();
            window.setTimeout(() => {
              replayingRender = false;
            }, 0);
          }
        } else if (Date.now() - started > 30000) {
          window.clearInterval(wait);
        }
      }, 150);
    };

    document.addEventListener("input", onInput, true);
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(debounce);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
