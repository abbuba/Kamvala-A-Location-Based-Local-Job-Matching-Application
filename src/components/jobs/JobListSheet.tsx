import type { Listing } from '../../types/listing'
import { JobCard } from './JobCard'
import { SkeletonCard } from '../ui/Skeleton'

interface JobListSheetProps {
  listings: Listing[]
  isLoading: boolean
  jobTypeLabels: Record<string, string>
  onSelect: (id: string) => void
  selectedId?: string | null
}

export function JobListSheet({
  listings,
  isLoading,
  jobTypeLabels,
  onSelect,
  selectedId,
}: JobListSheetProps) {
  return (
    <section className="ios-sheet flex max-h-56 flex-col gap-2 overflow-y-auto px-4 pb-5 pt-0" aria-label="Nearby job listings">
      <div className="ios-sheet-handle" aria-hidden="true" />
      <h2 className="text-[17px] font-semibold text-kamvala-text">
        {isLoading ? 'Searching…' : `${listings.length} job${listings.length === 1 ? '' : 's'} nearby`}
      </h2>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : listings.length === 0 ? (
        <p className="py-6 text-center text-[15px] text-kamvala-muted">
          No jobs in this radius. Try increasing distance or clearing filters.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {listings.map((listing) => (
            <JobCard
              key={listing.id}
              listing={listing}
              jobTypeLabels={jobTypeLabels}
              onClick={() => onSelect(listing.id)}
              isSelected={selectedId === listing.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
