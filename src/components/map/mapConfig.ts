import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp.js'
import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker.js?worker'
import type { Coordinates } from '../../types/listing'

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12'
export const hasMapboxToken = Boolean(MAPBOX_TOKEN?.length)

mapboxgl.workerClass = MapboxWorker as unknown as typeof mapboxgl.workerClass
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN
}

export { mapboxgl, MapboxWorker }

export function zoomForRadius(radiusKm: number): number {
  if (radiusKm <= 1) return 14
  if (radiusKm <= 2) return 13
  if (radiusKm <= 5) return 12
  return 11
}

export function createCircleGeoJSON(center: Coordinates, radiusKm: number, points = 64) {
  const coords: [number, number][] = []
  const distanceX = radiusKm / (111.32 * Math.cos((center.lat * Math.PI) / 180))
  const distanceY = radiusKm / 110.574

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI)
    coords.push([center.lng + distanceX * Math.cos(theta), center.lat + distanceY * Math.sin(theta)])
  }
  coords.push(coords[0])

  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [coords],
    },
    properties: {},
  }
}
