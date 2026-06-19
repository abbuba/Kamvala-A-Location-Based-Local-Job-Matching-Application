import Map, { Marker } from 'react-map-gl/mapbox'
import type { Coordinates } from '../../types/listing'
import {
  hasMapboxToken,
  MAP_STYLE,
  MAPBOX_TOKEN,
  mapboxgl,
} from '../map/mapConfig'
import { MapFallback } from '../map/MapFallback'
import { MapViewSync } from '../map/MapViewSync'
import { MapErrorBoundary } from '../map/MapErrorBoundary'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapPinPickerProps {
  center: Coordinates
  onChange: (coords: Coordinates) => void
}

export function MapPinPicker({ center, onChange }: MapPinPickerProps) {
  if (!hasMapboxToken) {
    return (
      <div className="h-52 w-full overflow-hidden">
        <MapFallback />
      </div>
    )
  }

  return (
    <div className="h-52 w-full overflow-hidden">
      <MapErrorBoundary>
        <Map
          mapLib={mapboxgl}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: center.lng,
            latitude: center.lat,
            zoom: 14,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={MAP_STYLE}
          attributionControl={false}
          onClick={(e) => onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
          onLoad={(e) => e.target.resize()}
        >
          <MapViewSync center={center} zoom={14} />
          <Marker
            longitude={center.lng}
            latitude={center.lat}
            anchor="bottom"
            draggable
            onDragEnd={(e) => onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
          />
        </Map>
      </MapErrorBoundary>
    </div>
  )
}
