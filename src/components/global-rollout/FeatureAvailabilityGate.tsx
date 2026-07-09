"use client";

import type { ReactNode } from "react";

import { useGlobalRollout } from "@/components/global-rollout/GlobalRolloutProvider";
import RegionalAvailabilityNotice from "@/components/global-rollout/RegionalAvailabilityNotice";
import { isFeatureEnabled } from "@/lib/global-rollout/service";
import type { RolloutFeature } from "@/types/global-rollout";

export default function FeatureAvailabilityGate({
  feature,
  featureLabel,
  children,
}: {
  feature: RolloutFeature;
  featureLabel: string;
  children: ReactNode;
}) {
  const { activeCountry } = useGlobalRollout();

  if (!isFeatureEnabled(feature, activeCountry.code)) {
    return <RegionalAvailabilityNotice featureLabel={featureLabel} />;
  }

  return <>{children}</>;
}
