"use client";

import { FormEvent, useMemo, useState } from "react";

type AssetRole = "primary" | "cover" | "sample";

type UploadResult = {
  storagePath: string;
  signedUrl: string;
};

function csrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )edunancial_admin_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function uploadAsset(file: File, role: AssetRole) {
  const token = csrfToken();
  const prepared = await fetch("/api/admin/marketplace/products/presign", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": token,
    },
    body: JSON.stringify({ name: file.name, size: file.size, type: file.type, role }),
  });
  const payload = (await prepared.json()) as UploadResult & { error?: string };
  if (!prepared.ok) throw new Error(payload.error || `Unable to prepare ${role} upload.`);

  const uploaded = await fetch(payload.signedUrl, {
    method: "PUT",
    headers: file.type ? { "Content-Type": file.type } : undefined,
    body: file,
  });
  if (!uploaded.ok) throw new Error(`Unable to upload ${file.name}.`);
  return payload.storagePath;
}

export default function MarketplaceProductUploader() {
  const [primary, setPrimary] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [sample, setSample] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileSummary = useMemo(
    () => [primary && `Primary: ${primary.name}`, cover && `Cover: ${cover.name}`, sample && `Sample: ${sample.name}`]
      .filter(Boolean)
      .join(" · "),
    [primary, cover, sample],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const form = new FormData(event.currentTarget);
      const primaryAssetPath = primary ? await uploadAsset(primary, "primary") : "";
      const coverAssetPath = cover ? await uploadAsset(cover, "cover") : "";
      const sampleAssetPath = sample ? await uploadAsset(sample, "sample") : "";
      const price = Number(form.get("price") || 0);
      const token = csrfToken();

      const response = await fetch("/api/admin/marketplace/products", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": token,
        },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          productType: form.get("productType"),
          authorName: form.get("authorName"),
          priceCents: Math.round(price * 100),
          currency: form.get("currency"),
          languageCode: form.get("languageCode"),
          countryCode: form.get("countryCode"),
          category: form.get("category"),
          tags: String(form.get("tags") || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          primaryAssetPath,
          coverAssetPath,
          sampleAssetPath,
        }),
      });
      const payload = (await response.json()) as { error?: string; product?: { title?: string } };
      if (!response.ok) throw new Error(payload.error || "Unable to save marketplace product.");

      setMessage(`${payload.product?.title || "Product"} saved as a Marketplace draft.`);
      event.currentTarget.reset();
      setPrimary(null);
      setCover(null);
      setSample(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Marketplace upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          Product title
          <input name="title" required className="rounded-xl bg-[#08101f] p-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Product type
          <select name="productType" required className="rounded-xl bg-[#08101f] p-3 font-normal">
            <option value="EBOOK">eBook</option>
            <option value="AUDIOBOOK">Audiobook</option>
            <option value="COURSE">Course</option>
            <option value="TEMPLATE">Template</option>
            <option value="WORKBOOK">Workbook</option>
            <option value="DOWNLOAD">Digital Download</option>
            <option value="BUSINESS_TOOL">Business Tool</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        Description
        <textarea name="description" rows={5} className="rounded-xl bg-[#08101f] p-3 font-normal" />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold">
          Author / creator
          <input name="authorName" className="rounded-xl bg-[#08101f] p-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Price
          <input name="price" type="number" min="0" step="0.01" defaultValue="0" className="rounded-xl bg-[#08101f] p-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Currency
          <input name="currency" defaultValue="USD" maxLength={3} className="rounded-xl bg-[#08101f] p-3 font-normal uppercase" />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold">
          Language
          <input name="languageCode" defaultValue="en-US" className="rounded-xl bg-[#08101f] p-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Country (optional)
          <input name="countryCode" maxLength={2} className="rounded-xl bg-[#08101f] p-3 font-normal uppercase" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Category
          <input name="category" className="rounded-xl bg-[#08101f] p-3 font-normal" />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        Tags, separated by commas
        <input name="tags" className="rounded-xl bg-[#08101f] p-3 font-normal" />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold">
          Primary product file
          <input type="file" onChange={(event) => setPrimary(event.target.files?.[0] ?? null)} className="text-sm font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Cover image
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setCover(event.target.files?.[0] ?? null)} className="text-sm font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Sample / preview file
          <input type="file" onChange={(event) => setSample(event.target.files?.[0] ?? null)} className="text-sm font-normal" />
        </label>
      </div>

      {fileSummary ? <p className="text-xs text-gray-400">{fileSummary}</p> : null}
      {message ? <p className="rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-xl bg-red-400/10 p-4 text-sm text-red-200">{error}</p> : null}

      <button disabled={busy} className="rounded-xl bg-blue-600 px-5 py-4 text-lg font-black disabled:opacity-50">
        {busy ? "Uploading and saving…" : "Upload & Save Draft"}
      </button>
      <p className="text-xs leading-5 text-gray-500">
        Saving a product creates a private Marketplace draft. It does not publish the product or make it purchasable.
      </p>
    </form>
  );
}
