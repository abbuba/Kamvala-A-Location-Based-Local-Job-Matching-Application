export type PayPeriod = 'hourly' | 'monthly'

export interface Coordinates {
  lat: number
  lng: number
}

export interface ListingLocation extends Coordinates {
  address: string
}

export interface Listing {
  id: string
  shopName: string
  title: string
  jobTypes: string[]
  languages: string[]
  payMin: number
  payMax: number
  payPeriod: PayPeriod
  location: ListingLocation
  description: string
  contactPhone: string
  postedAt: string
  storeImage?: string
}

export interface CreateListingInput {
  shopName: string
  title: string
  jobTypes: string[]
  languages: string[]
  payMin: number
  payMax: number
  payPeriod: PayPeriod
  location: ListingLocation
  description: string
  contactPhone: string
  storeImage?: string
}

export interface JobType {
  id: string
  label: string
}

export interface Language {
  id: string
  label: string
}

export interface ListingFilters {
  jobType: string | null
  language: string | null
  minPay: number | null
}

export const DEFAULT_CENTER: Coordinates = {
  lat: 17.385,
  lng: 78.4867,
}

export const RADIUS_OPTIONS_KM = [1, 2, 5, 10] as const
export type RadiusKm = (typeof RADIUS_OPTIONS_KM)[number]

export const MAX_STORE_IMAGE_BYTES = 500 * 1024
