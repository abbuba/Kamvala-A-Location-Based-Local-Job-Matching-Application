import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ExplorePage from './ExplorePage'
import { LocationProvider } from '../context/LocationContext'
import { FilterProvider } from '../context/FilterContext'

vi.mock('../components/map/JobMap', () => ({
  JobMap: () => <div data-testid="job-map">Map</div>,
}))

const mockListings = [
  {
    id: '1',
    shopName: 'Near Shop',
    title: 'Cashier',
    jobTypes: ['cashier'],
    languages: ['en'],
    payMin: 12000,
    payMax: 15000,
    payPeriod: 'monthly' as const,
    location: { lat: 28.6152, lng: 77.2089, address: 'Near' },
    description: 'Test',
    contactPhone: '+91 000',
    postedAt: '2026-01-01',
  },
]

vi.mock('../hooks/useNearbyListings', () => ({
  useNearbyListings: vi.fn(() => ({
    listings: mockListings,
    isLoading: false,
    error: null,
  })),
}))

vi.mock('../components/jobs/FilterBar', () => ({
  FilterBar: () => <div data-testid="filter-bar" />,
  useJobTypeLabels: () => ({ cashier: 'Cashier' }),
}))

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    ),
  )

  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: (success: PositionCallback) =>
        success({
          coords: {
            latitude: 17.385,
            longitude: 78.4867,
            accuracy: 1,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
            toJSON: () => ({}),
          },
          timestamp: Date.now(),
        }),
    },
    configurable: true,
  })
})

function renderExplore() {
  return render(
    <MemoryRouter>
      <LocationProvider>
        <FilterProvider>
          <ExplorePage />
        </FilterProvider>
      </LocationProvider>
    </MemoryRouter>,
  )
}

describe('ExplorePage', () => {
  it('renders Explore header and job count', async () => {
    renderExplore()
    expect(screen.getByText('Explore')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('1 job nearby')).toBeInTheDocument()
    })
  })

  it('updates radius when segment is clicked', async () => {
    const user = userEvent.setup()
    renderExplore()

    const oneKm = screen.getByRole('button', { name: '1 km' })
    await user.click(oneKm)
    expect(oneKm).toHaveAttribute('aria-pressed', 'true')
  })
})
