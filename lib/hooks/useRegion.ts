'use client';

import { usePathname } from 'next/navigation';

export type RegionCode =
  | 'us'
  | 'latam'
  | 'caribbean'
  | 'eu'
  | 'mena'
  | 'africa'
  | 'asia';

const DEFAULT_REGION: RegionCode = 'us';

export function useRegion(): RegionCode {
  const pathname = usePathname();

  if (!pathname) return DEFAULT_REGION;

  const segments = pathname.toLowerCase().split('/').filter(Boolean);

  const region = segments[0] as RegionCode | undefined;

  switch (region) {
    case 'us':
    case 'latam':
    case 'caribbean':
    case 'eu':
    case 'mena':
    case 'africa':
    case 'asia':
      return region;
    default:
      return DEFAULT_REGION;
  }
}
