"use client";

import { useMemo } from "react";
import { getruntimesitekey, getruntimelang } from "../lib/runtime";
import { siteconfigs } from "../data/site-configs";
import { copydata } from "../data/copy";
import { sections } from "./sections";

export default function SiteHome() {
  const sitekey = useMemo(() => getruntimesitekey(), []);
  const lang = useMemo(() => getruntimelang(), []);

  const config = siteconfigs[sitekey] ?? siteconfigs["us-main"];
  const copy =
    copydata[lang]?.[sitekey] ??
    copydata["en"]["us-main"];

  return (
    <main>
      {config.sections.map((key: string) => {
        const Section = sections[key];
        return Section ? (
          <Section
            key={key}
            sitekey={sitekey}
            lang={lang}
            copy={copy}
          />
        ) : null;
      })}
    </main>
  );
}
