import { describe, expect, it } from 'vitest'
import { DEFAULT_CENTER } from '../types/listing'
import { filterByRadius, haversineDistanceKm, isWithinRadiusKm } from './geo'

const nearbyHyd = { lat: 17.387, lng: 78.488 }

describe('haversineDistanceKm', () => {
  it('returns 0 for identical points', () => {
    expect(haversineDistanceKm(DEFAULT_CENTER, DEFAULT_CENTER)).toBe(0)
  })

  it('computes distance between two known points in Hyderabad', () => {
    const distance = haversineDistanceKm(DEFAULT_CENTER, nearbyHyd)
    expect(distance).toBeGreaterThan(0)
    expect(distance).toBeLessThan(2)
  })
})

describe('isWithinRadiusKm', () => {
  it('includes points within radius', () => {
    expect(isWithinRadiusKm(DEFAULT_CENTER, nearbyHyd, 5)).toBe(true)
  })

  it('excludes distant points', () => {
    const far = { lat: 19.076, lng: 72.8777 }
    expect(isWithinRadiusKm(DEFAULT_CENTER, far, 5)).toBe(false)
  })
})

describe('filterByRadius', () => {
  it('filters listings by radius', () => {
    const items = [
      { id: '1', location: { lat: 17.387, lng: 78.488, address: 'Near' } },
      { id: '2', location: { lat: 19.076, lng: 72.8777, address: 'Far' } },
    ]
    const result = filterByRadius(items, DEFAULT_CENTER, 5)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })
})
