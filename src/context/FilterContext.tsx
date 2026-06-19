import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ListingFilters, RadiusKm } from '../types/listing'
import { RADIUS_OPTIONS_KM } from '../types/listing'

interface FilterContextValue {
  radiusKm: RadiusKm
  setRadiusKm: (radius: RadiusKm) => void
  radiusOptions: readonly RadiusKm[]
  filters: ListingFilters
  setJobType: (jobType: string | null) => void
  setLanguage: (language: string | null) => void
  setMinPay: (minPay: number | null) => void
  clearFilters: () => void
}

const defaultFilters: ListingFilters = {
  jobType: null,
  language: null,
  minPay: null,
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [radiusKm, setRadiusKm] = useState<RadiusKm>(5)
  const [filters, setFilters] = useState<ListingFilters>(defaultFilters)

  const setJobType = (jobType: string | null) => {
    setFilters((prev) => ({ ...prev, jobType }))
  }

  const setLanguage = (language: string | null) => {
    setFilters((prev) => ({ ...prev, language }))
  }

  const setMinPay = (minPay: number | null) => {
    setFilters((prev) => ({ ...prev, minPay }))
  }

  const clearFilters = () => setFilters(defaultFilters)

  const value = useMemo(
    () => ({
      radiusKm,
      setRadiusKm,
      radiusOptions: RADIUS_OPTIONS_KM,
      filters,
      setJobType,
      setLanguage,
      setMinPay,
      clearFilters,
    }),
    [radiusKm, filters],
  )

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilterContext() {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error('useFilterContext must be used within FilterProvider')
  }
  return ctx
}
