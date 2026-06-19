import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_CENTER, type Coordinates } from '../types/listing'
import { useGeolocation } from '../hooks/useGeolocation'

interface LocationContextValue {
  center: Coordinates
  isLoading: boolean
  error: string | null
  usingFallback: boolean
  setCenter: (coords: Coordinates) => void
  refreshLocation: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const geo = useGeolocation()
  const [manualCenter, setManualCenter] = useState<Coordinates | null>(null)

  const center = manualCenter ?? geo.coords ?? DEFAULT_CENTER
  const usingFallback = !manualCenter && !geo.coords

  const setCenter = useCallback((coords: Coordinates) => {
    setManualCenter(coords)
  }, [])

  const value = useMemo(
    () => ({
      center,
      isLoading: geo.isLoading,
      error: geo.error,
      usingFallback,
      setCenter,
      refreshLocation: geo.refresh,
    }),
    [center, geo.isLoading, geo.error, usingFallback, setCenter, geo.refresh],
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocationContext() {
  const ctx = useContext(LocationContext)
  if (!ctx) {
    throw new Error('useLocationContext must be used within LocationProvider')
  }
  return ctx
}
