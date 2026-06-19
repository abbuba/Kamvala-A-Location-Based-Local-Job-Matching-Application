import { useNavigate } from 'react-router-dom'
import { FilterBar, useJobTypeLabels } from '../components/jobs/FilterBar'
import { JobListSheet } from '../components/jobs/JobListSheet'
import { JobMap } from '../components/map/JobMap'
import { RadiusControl } from '../components/map/RadiusControl'
import { useLocationContext } from '../context/LocationContext'
import { useNearbyListings } from '../hooks/useNearbyListings'
import { useState } from 'react'

export default function ExplorePage() {
  const navigate = useNavigate()
  const { usingFallback } = useLocationContext()
  const { listings, isLoading } = useNearbyListings()
  const jobTypeLabels = useJobTypeLabels()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    navigate(`/explore/${id}`)
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="shrink-0 bg-white/90 px-4 pb-3 pt-2 backdrop-blur">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-kamvala-text">Explore</h1>
            <p className="text-[13px] text-kamvala-muted">Jobs near you in Hyderabad</p>
          </div>
          {usingFallback && (
            <span className="mb-1 rounded-full bg-kamvala-gray px-2.5 py-1 text-[11px] font-medium text-kamvala-muted">
              Demo area
            </span>
          )}
        </div>
        <RadiusControl />
      </header>

      <FilterBar />

      <div className="relative min-h-0 flex-1 bg-kamvala-gray">
        <JobMap
          listings={listings}
          onSelectListing={handleSelect}
          selectedId={selectedId}
        />
      </div>

      <JobListSheet
        listings={listings}
        isLoading={isLoading}
        jobTypeLabels={jobTypeLabels}
        onSelect={handleSelect}
        selectedId={selectedId}
      />
    </div>
  )
}
