/**
 * GlossaryTerm — marks a financial vocabulary term inline.
 *
 * Currently renders as an accessible <abbr> with a dotted underline and
 * tooltip.  When the site-wide glossary pages are live, pass `href` to turn
 * the term into a link.
 *
 * Usage:
 *   <GlossaryTerm term="Cash Flow">cash flow</GlossaryTerm>
 *   <GlossaryTerm term="REIT" href="/glossary/reit">REIT</GlossaryTerm>
 */

import Link from "next/link";
import type { ReactNode } from "react";

interface GlossaryTermProps {
  /** Canonical term name used for data attributes, tooltips, and future linking. */
  term: string;
  /** Display text (may differ from term, e.g. plural or mid-sentence form). */
  children: ReactNode;
  /** Future: path to the glossary definition page, e.g. "/glossary/cash-flow". */
  href?: string;
}

export default function GlossaryTerm({ term, children, href }: GlossaryTermProps) {
  const sharedProps = {
    "data-glossary-term": term,
    title: `Glossary: ${term}`,
    className:
      "font-semibold text-yellow-300 underline decoration-dotted underline-offset-2 cursor-help",
  };

  if (href) {
    return (
      <Link href={href} {...sharedProps} className={`${sharedProps.className} cursor-pointer hover:text-yellow-200`}>
        {children}
      </Link>
    );
  }

  return (
    <abbr {...sharedProps}>
      {children}
    </abbr>
  );
}
