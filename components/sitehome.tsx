"use client";

import { getruntimesitekey, getruntimelang } from "../lib/runtime";
import { siteconfigs } from "../data/site-configs";
import { copydata } from "../data/copy";
import { sections } from "./sections";

export default function SiteHome() {
  const sitekey = getruntimesitekey();
  const lang = getruntimelang();

  const cfg = siteconfigs[sitekey] ?? siteconfigs["us-main"];
  const copy =
    copydata[lang]?.[sitekey] ??
    copydata["en"]["us-main"];

  return (
    <main>
      {cfg.sections.map((key: string) => {
        const Section = sections[key];
        if (!Section) return null;
        return <Section key={key} copy={copy} />;
      })}
    </main>
  );
}
