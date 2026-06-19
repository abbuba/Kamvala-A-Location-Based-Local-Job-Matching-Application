import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_CENTER, type Coordinates } from '../types/listing'

interface GeolocationState {
  coords: Coordinates | null
  isLoading: boolean
  error: string | null
}

function getInitialState(): GeolocationState {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return {
      coords: DEFAULT_CENTER,
      isLoading: false,
      error: 'Geolocation is not supported',
    }
  }
  return { coords: null, isLoading: true, error: null }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(getInitialState)

  const requestLocation = useCallback((isRefresh = false) => {
    if (!navigator.geolocation) {
      setState({
        coords: DEFAULT_CENTER,
        isLoading: false,
        error: 'Geolocation is not supported',
      })
      return
    }

    if (isRefresh) {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          isLoading: false,
          error: null,
        })
      },
      () => {
        setState({
          coords: null,
          isLoading: false,
          error: 'Location access denied — using default area',
        })
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    requestLocation()
  }, [requestLocation])

  return {
    ...state,
    refresh: () => requestLocation(true),
  }
}
