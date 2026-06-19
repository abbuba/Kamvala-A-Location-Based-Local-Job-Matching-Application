import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fetchNearbyListings } from './listingsService'
import { DEFAULT_CENTER } from '../types/listing'

const mockListings = [
  {
    id: '1',
    shopName: 'Test Shop',
    title: 'Cashier',
    jobTypes: ['cashier'],
    languages: ['en'],
    payMin: 12000,
    payMax: 15000,
    payPeriod: 'monthly' as const,
    location: { lat: 17.387, lng: 78.488, address: 'Abids, Hyderabad' },
    description: 'Test',
    contactPhone: '+91 000',
    postedAt: '2026-01-01',
  },
  {
    id: '2',
    shopName: 'Far Shop',
    title: 'Cook',
    jobTypes: ['cook'],
    languages: ['hi'],
    payMin: 10000,
    payMax: 12000,
    payPeriod: 'monthly' as const,
    location: { lat: 19.076, lng: 72.8777, address: 'Mumbai' },
    description: 'Far',
    contactPhone: '+91 111',
    postedAt: '2026-01-01',
  },
]

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockListings),
      }),
    ),
  )
})

describe('fetchNearbyListings', () => {
  it('filters by radius', async () => {
    const results = await fetchNearbyListings(DEFAULT_CENTER, 5, {
      jobType: null,
      language: null,
      minPay: null,
    })
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('filters by job type', async () => {
    const results = await fetchNearbyListings(DEFAULT_CENTER, 10, {
      jobType: 'cook',
      language: null,
      minPay: null,
    })
    expect(results).toHaveLength(0)
  })

  it('filters by minimum pay', async () => {
    const results = await fetchNearbyListings(DEFAULT_CENTER, 5, {
      jobType: null,
      language: null,
      minPay: 20000,
    })
    expect(results).toHaveLength(0)
  })
})
