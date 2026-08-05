import type { Metadata } from "next";

import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog | Edunancial",
  description:
    "Practical financial education articles on real estate, business, investing, and economic self-defense.",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
