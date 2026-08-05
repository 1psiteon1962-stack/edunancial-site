"use client";

import ComingSoon from "@/components/ComingSoon";

export default function SponsorComingSoon() {
  return (
    <div className="mt-6 mb-8">
      <ComingSoon
        labelKey="comingSoon.label"
        headingKey="comingSoon.sponsor.heading"
        bodyKey="comingSoon.sponsor.body"
      />
    </div>
  );
}
