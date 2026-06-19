import type {
  CreateListingInput,
  JobType,
  Language,
  Listing,
  ListingFilters,
} from '../types/listing'
import { seedJobTypes, seedLanguages, seedListings } from '../data/seed'
import { filterByRadius } from './geo'
import { apiClient } from './apiClient'

async function withSeedFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher()
  } catch {
    return fallback
  }
}

export async function fetchListings(signal?: AbortSignal): Promise<Listing[]> {
  return withSeedFallback(
    () => apiClient<Listing[]>('/listings', { signal }),
    seedListings,
  )
}

export async function fetchListingById(id: string, signal?: AbortSignal): Promise<Listing> {
  return withSeedFallback(
    () => apiClient<Listing>(`/listings/${id}`, { signal }),
    seedListings.find((l) => l.id === id) ?? seedListings[0],
  )
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  const payload = {
    ...input,
    postedAt: new Date().toISOString(),
  }
  try {
    return await apiClient<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch {
    return {
      ...payload,
      id: `local-${Date.now()}`,
    }
  }
}

export async function fetchJobTypes(signal?: AbortSignal): Promise<JobType[]> {
  return withSeedFallback(
    () => apiClient<JobType[]>('/jobTypes', { signal }),
    seedJobTypes,
  )
}

export async function fetchLanguages(signal?: AbortSignal): Promise<Language[]> {
  return withSeedFallback(
    () => apiClient<Language[]>('/languages', { signal }),
    seedLanguages,
  )
}

export async function fetchNearbyListings(
  center: { lat: number; lng: number },
  radiusKm: number,
  filters: ListingFilters,
  signal?: AbortSignal,
  extraListings: Listing[] = [],
): Promise<Listing[]> {
  const all = await fetchListings(signal)
  const mergedById = new Map<string, Listing>()

  for (const listing of [...all, ...extraListings]) {
    mergedById.set(String(listing.id), listing)
  }

  const nearby = filterByRadius([...mergedById.values()], center, radiusKm)

  return nearby.filter((listing) => {
    if (filters.jobType && !listing.jobTypes.includes(filters.jobType)) {
      return false
    }
    if (filters.language && !listing.languages.includes(filters.language)) {
      return false
    }
    if (filters.minPay !== null && listing.payMax < filters.minPay) {
      return false
    }
    return true
  })
}
