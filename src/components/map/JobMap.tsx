import { useMemo } from 'react'
import Map, { Layer, Marker, Source } from 'react-map-gl/mapbox'
import type { Listing } from '../../types/listing'
import { useLocationContext } from '../../context/LocationContext'
import { useFilterContext } from '../../context/FilterContext'
import {
  createCircleGeoJSON,
  hasMapboxToken,
  MAP_STYLE,
  MAPBOX_TOKEN,
  mapboxgl,
  zoomForRadius,
} from './mapConfig'
import { MapFallback } from './MapFallback'
import { MapViewSync } from './MapViewSync'
import { MapErrorBoundary } from './MapErrorBoundary'
import 'mapbox-gl/dist/mapbox-gl.css'

interface JobMapProps {
  listings: Listing[]
  onSelectListing: (id: string) => void
  selectedId?: string | null
}

export function JobMap({ listings, onSelectListing, selectedId }: JobMapProps) {
  const { center } = useLocationContext()
  const { radiusKm } = useFilterContext()

  const circleData = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: [createCircleGeoJSON(center, radiusKm)],
    }),
    [center, radiusKm],
  )

  if (!hasMapboxToken) {
    return <MapFallback />
  }

  return (
    <MapErrorBoundary>
      <div className="absolute inset-0">
        <Map
          mapLib={mapboxgl}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: center.lng,
            latitude: center.lat,
            zoom: zoomForRadius(radiusKm),
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={MAP_STYLE}
          attributionControl={false}
          onLoad={(e) => e.target.resize()}
        >
          <MapViewSync center={center} radiusKm={radiusKm} />

          <Source id="radius" type="geojson" data={circleData}>
            <Layer
              id="radius-fill"
              type="fill"
              paint={{ 'fill-color': '#007aff', 'fill-opacity': 0.08 }}
            />
            <Layer
              id="radius-outline"
              type="line"
              paint={{ 'line-color': '#007aff', 'line-width': 2 }}
            />
          </Source>

          <Marker longitude={center.lng} latitude={center.lat} anchor="center">
            <div
              className="h-3.5 w-3.5 rounded-full border-[3px] border-white bg-kamvala-blue shadow-[0_0_0_2px_rgba(0,122,255,0.4)]"
              title="You are here"
            />
          </Marker>

          {listings.map((listing) => (
            <Marker
              key={listing.id}
              longitude={listing.location.lng}
              latitude={listing.location.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                onSelectListing(listing.id)
              }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`${listing.title} at ${listing.shopName}`}
                className={`h-3 w-3 cursor-pointer rounded-full border-2 border-white bg-red-500 shadow-md transition-opacity ${selectedId && selectedId !== listing.id ? 'opacity-50' : 'opacity-100'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectListing(listing.id)
                  }
                }}
              />
            </Marker>
          ))}
        </Map>
      </div>
    </MapErrorBoundary>
  )
}
