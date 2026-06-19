import { useEffect } from 'react'
import { useMap } from 'react-map-gl/mapbox'
import type { Coordinates } from '../../types/listing'
import { zoomForRadius } from './mapConfig'

interface MapViewSyncProps {
  center: Coordinates
  radiusKm?: number
  zoom?: number
}

export function MapViewSync({ center, radiusKm, zoom }: MapViewSyncProps) {
  const { current: map } = useMap()

  useEffect(() => {
    if (!map) return

    const targetZoom = zoom ?? (radiusKm !== undefined ? zoomForRadius(radiusKm) : map.getZoom())

    const sync = () => {
      map.resize()
      map.flyTo({
        center: [center.lng, center.lat],
        zoom: targetZoom,
        duration: 400,
      })
    }

    if (map.isStyleLoaded()) {
      sync()
    } else {
      map.once('load', sync)
    }
  }, [map, center.lat, center.lng, radiusKm, zoom])

  return null
}
