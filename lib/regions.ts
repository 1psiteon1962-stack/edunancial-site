export const regions = ['us', 'mena', 'eu', 'latam']

export function getRegion(region: string) {
  if (regions.includes(region)) return region
  return 'us'
}
