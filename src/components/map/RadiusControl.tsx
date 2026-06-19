import { useFilterContext } from '../../context/FilterContext'
import type { RadiusKm } from '../../types/listing'

export function RadiusControl() {
  const { radiusKm, setRadiusKm, radiusOptions } = useFilterContext()

  return (
    <div className="ios-segmented" role="group" aria-label="Search radius in kilometers">
      {radiusOptions.map((km) => (
        <button
          key={km}
          type="button"
          onClick={() => setRadiusKm(km as RadiusKm)}
          aria-pressed={radiusKm === km}
          className="ios-segment"
        >
          {km} km
        </button>
      ))}
    </div>
  )
}
