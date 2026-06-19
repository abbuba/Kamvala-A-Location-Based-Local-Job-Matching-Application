import { RouterProvider } from 'react-router-dom'
import { PhoneFrame } from './components/layout/PhoneFrame'
import { FilterProvider } from './context/FilterContext'
import { ListingsProvider } from './context/ListingsContext'
import { LocationProvider } from './context/LocationContext'
import { router } from './router'

export default function App() {
  return (
    <PhoneFrame>
      <LocationProvider>
        <FilterProvider>
          <ListingsProvider>
            <RouterProvider router={router} />
          </ListingsProvider>
        </FilterProvider>
      </LocationProvider>
    </PhoneFrame>
  )
}
