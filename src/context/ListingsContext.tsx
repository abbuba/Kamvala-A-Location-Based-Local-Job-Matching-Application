import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Listing } from '../types/listing'

interface ListingsContextValue {
  refreshKey: number
  localListings: Listing[]
  refreshListings: () => void
  addListing: (listing: Listing) => void
}

const ListingsContext = createContext<ListingsContextValue | null>(null)

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [localListings, setLocalListings] = useState<Listing[]>([])

  const refreshListings = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const addListing = useCallback((listing: Listing) => {
    setLocalListings((prev) => {
      const without = prev.filter((item) => item.id !== listing.id)
      return [...without, listing]
    })
    setRefreshKey((k) => k + 1)
  }, [])

  const value = useMemo(
    () => ({ refreshKey, localListings, refreshListings, addListing }),
    [refreshKey, localListings, refreshListings, addListing],
  )

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListingsContext() {
  const ctx = useContext(ListingsContext)
  if (!ctx) {
    throw new Error('useListingsContext must be used within ListingsProvider')
  }
  return ctx
}
