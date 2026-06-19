import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EnlistForm } from './EnlistForm'
import { LocationProvider } from '../../context/LocationContext'
import { FilterProvider } from '../../context/FilterContext'
import { ListingsProvider } from '../../context/ListingsContext'

const navigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock('../../services/listingsService', () => ({
  fetchJobTypes: vi.fn(() =>
    Promise.resolve([
      { id: 'cashier', label: 'Cashier' },
      { id: 'cook', label: 'Cook' },
    ]),
  ),
  fetchLanguages: vi.fn(() =>
    Promise.resolve([
      { id: 'en', label: 'English' },
      { id: 'hi', label: 'Hindi' },
    ]),
  ),
  createListing: vi.fn(() =>
    Promise.resolve({
      id: '99',
      shopName: 'Test Shop',
      title: 'Helper',
      jobTypes: ['cashier'],
      languages: ['en'],
      payMin: 10000,
      payMax: 12000,
      payPeriod: 'monthly',
      location: { lat: 17.385, lng: 78.4867, address: 'Test Street' },
      description: 'Need help daily',
      contactPhone: '+91 99999 88888',
      postedAt: '2026-06-19T10:00:00Z',
    }),
  ),
}))

function renderForm() {
  return render(
    <MemoryRouter>
      <LocationProvider>
        <FilterProvider>
          <ListingsProvider>
            <EnlistForm />
          </ListingsProvider>
        </FilterProvider>
      </LocationProvider>
    </MemoryRouter>,
  )
}

describe('EnlistForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /list my shop/i }))

    const errors = await screen.findAllByText('Required')
    expect(errors.length).toBeGreaterThan(0)
  })

  it('submits valid form and opens explore', async () => {
    const user = userEvent.setup()
    const { createListing } = await import('../../services/listingsService')
    navigate.mockClear()
    renderForm()

    await user.type(screen.getByPlaceholderText('Charminar Kirana'), 'Test Shop')
    await user.type(screen.getByPlaceholderText('Shop Assistant'), 'Helper')
    await user.click(screen.getByRole('button', { name: 'Cashier' }))
    await user.click(screen.getByRole('button', { name: 'English' }))
    await user.type(screen.getByPlaceholderText('₹10,000'), '10000')
    await user.type(screen.getByPlaceholderText('₹15,000'), '12000')
    await user.type(screen.getByPlaceholderText('Street, area, Hyderabad'), 'Test Street')
    await user.type(screen.getByPlaceholderText('Describe the role, hours, and requirements'), 'Need help daily')
    await user.type(screen.getByPlaceholderText('+91 98765 43210'), '+91 99999 88888')

    await user.click(screen.getByRole('button', { name: /list my shop/i }))

    await waitFor(() => {
      expect(createListing).toHaveBeenCalled()
      expect(navigate).toHaveBeenCalledWith('/explore')
    })
  })
})
