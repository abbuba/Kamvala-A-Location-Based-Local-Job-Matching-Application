const EARTH_RADIUS_KM = 6371

export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const lat1 = toRad(from.lat)
  const lat2 = toRad(to.lat)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

export function isWithinRadiusKm(
  center: { lat: number; lng: number },
  point: { lat: number; lng: number },
  radiusKm: number,
): boolean {
  return haversineDistanceKm(center, point) <= radiusKm
}

export function filterByRadius<T extends { location: { lat: number; lng: number } }>(
  items: T[],
  center: { lat: number; lng: number },
  radiusKm: number,
): T[] {
  return items.filter((item) => isWithinRadiusKm(center, item.location, radiusKm))
}
