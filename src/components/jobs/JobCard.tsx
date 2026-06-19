import { memo } from 'react'
import type { Listing } from '../../types/listing'
import { StoreImage } from '../ui/StoreImage'

interface JobCardProps {
  listing: Listing
  jobTypeLabels: Record<string, string>
  onClick: () => void
  isSelected?: boolean
}

function formatPay(listing: Listing) {
  const period = listing.payPeriod === 'hourly' ? '/hr' : '/mo'
  if (listing.payMin === listing.payMax) {
    return `₹${listing.payMin.toLocaleString()}${period}`
  }
  return `₹${listing.payMin.toLocaleString()}–${listing.payMax.toLocaleString()}${period}`
}

export const JobCard = memo(function JobCard({
  listing,
  jobTypeLabels,
  onClick,
  isSelected,
}: JobCardProps) {
  const types = listing.jobTypes.map((t) => jobTypeLabels[t] ?? t).join(', ')

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl bg-kamvala-gray p-3 text-left transition-all active:opacity-70 ${isSelected ? 'ring-2 ring-kamvala-blue ring-offset-1' : ''}`}
      aria-label={`${listing.title} at ${listing.shopName}`}
    >
      <StoreImage shopName={listing.shopName} storeImage={listing.storeImage} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-kamvala-text">{listing.title}</h3>
            <p className="truncate text-[13px] text-kamvala-muted">{listing.shopName}</p>
          </div>
          <span className="shrink-0 text-[13px] font-semibold text-green-600">
            {formatPay(listing)}
          </span>
        </div>
        <p className="mt-1 truncate text-[12px] text-kamvala-muted">{types} · {listing.location.address}</p>
      </div>
    </button>
  )
})
