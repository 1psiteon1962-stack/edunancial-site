"use client";

import { PassportCertificate } from "@/lib/competency/types";

interface Props {
  certificate: PassportCertificate;
}

export default function CertificateActions({ certificate }: Props) {
  const earned = certificate.downloadUrl !== "";

  function handleDownload() {
    if (!earned) return;
    const link = document.createElement("a");
    link.href = certificate.downloadUrl;
    link.download = `${certificate.id}-certificate.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  async function handleShare() {
    if (!earned) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.title} — Edunancial`,
          text: `I earned the ${certificate.title} certificate on Edunancial!`,
          url: certificate.shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(certificate.shareUrl);
        alert("Share link copied to clipboard!");
      } catch {
        // Clipboard not available
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <button
        onClick={handleDownload}
        disabled={!earned}
        className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ⬇ Download
      </button>

      <button
        onClick={handleShare}
        disabled={!earned}
        className="rounded-xl border border-white/20 px-5 py-2 text-sm font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ↗ Share
      </button>
    </div>
  );
}
