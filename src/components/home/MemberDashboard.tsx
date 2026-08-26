"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MarketplaceItem = {
  entitlementId: string;
  product: {
    id: string;
    title: string;
    productType: string;
    authorName?: string | null;
    downloadable: boolean;
    downloadUrl?: string | null;
  };
};

export default function MemberDashboard() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [libraryState, setLibraryState] = useState<"loading" | "ready" | "signed-out" | "unavailable">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/member/marketplace/library", { credentials: "same-origin" })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401) {
          setLibraryState("signed-out");
          return;
        }
        if (!response.ok) throw new Error("library unavailable");
        const payload = (await response.json()) as { items?: MarketplaceItem[] };
        setItems(payload.items ?? []);
        setLibraryState("ready");
      })
      .catch(() => active && setLibraryState("unavailable"));
    return () => { active = false; };
  }, []);

  const books = items.filter((item) => ["EBOOK", "AUDIOBOOK", "WORKBOOK"].includes(item.product.productType));
  const courses = items.filter((item) => item.product.productType === "COURSE");
  const downloads = items.filter((item) => item.product.downloadable);

  return (
    <section className="bg-[#08101f] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-5xl font-black">Member Dashboard</h2>
        <p className="mt-6 text-xl text-gray-300">Your learning, purchases, credentials, and account in one place.</p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="Purchased Courses" detail={libraryDetail(libraryState, courses.length, "course")} />
          <DashboardCard title="My Books" detail={libraryDetail(libraryState, books.length, "book")} />
          <DashboardCard title="Certificates" detail="View credentials you earn as certificate delivery is activated." href="/credentials" />
          <DashboardCard title="Downloads" detail={libraryDetail(libraryState, downloads.length, "download")} />
          <DashboardCard title="Saved Progress" detail="Resume your Edunancial curriculum and saved learning progress." href="/learn" />
          <DashboardCard title="Account Settings" detail="Manage your member profile and account security." href="/account" />
        </div>

        {libraryState === "ready" && items.length > 0 ? (
          <div className="mt-14 rounded-2xl border border-slate-700 bg-slate-900 p-8">
            <h3 className="text-3xl font-black">Your Marketplace Library</h3>
            <div className="mt-6 grid gap-4">
              {items.map((item) => (
                <div key={item.entitlementId} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#08101f] p-5">
                  <div>
                    <p className="font-black">{item.product.title}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {item.product.productType.replaceAll("_", " ")}{item.product.authorName ? ` · ${item.product.authorName}` : ""}
                    </p>
                  </div>
                  {item.product.downloadable && item.product.downloadUrl ? (
                    <a href={item.product.downloadUrl} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-black">Secure Download</a>
                  ) : (
                    <span className="text-sm text-gray-500">Available in your account</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function libraryDetail(state: "loading" | "ready" | "signed-out" | "unavailable", count: number, noun: string) {
  if (state === "loading") return "Loading your library…";
  if (state === "signed-out") return "Sign in to see your purchases.";
  if (state === "unavailable") return "Your library is temporarily unavailable.";
  return count ? `${count} ${noun}${count === 1 ? "" : "s"} in your library.` : `No ${noun}s purchased yet.`;
}

function DashboardCard({ title, detail, href }: { title: string; detail: string; href?: string }) {
  const content = (
    <div className="h-full rounded-2xl border border-slate-700 bg-slate-900 p-8 transition hover:border-slate-500">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 text-gray-400">{detail}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
