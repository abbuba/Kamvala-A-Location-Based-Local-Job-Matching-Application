import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Listing } from '../types/listing'
import { fetchNearbyListings } from '../services/listingsService'
import { useLocationContext } from '../context/LocationContext'
import { useFilterContext } from '../context/FilterContext'
import { useListingsContext } from '../context/ListingsContext'

interface NearbyListingsState {
  listings: Listing[]
  isLoading: boolean
  error: string | null
}

export function useNearbyListings() {
  const { center } = useLocationContext()
  const { radiusKm, filters } = useFilterContext()
  const { refreshKey, localListings } = useListingsContext()
  const location = useLocation()
  const [state, setState] = useState<NearbyListingsState>({
    listings: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function load() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      try {
        const listings = await fetchNearbyListings(
          center,
          radiusKm,
          filters,
          controller.signal,
          localListings,
        )
        if (!cancelled) {
          setState({ listings, isLoading: false, error: null })
        }
      } catch (err) {
        if (!cancelled && err instanceof Error && err.name !== 'AbortError') {
          setState({ listings: [], isLoading: false, error: err.message })
        }
      }
    }

    load()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [center, radiusKm, filters, refreshKey, localListings, location.pathname])

  return state
}
