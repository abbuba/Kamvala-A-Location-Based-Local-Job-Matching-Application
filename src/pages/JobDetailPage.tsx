import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchJobTypes, fetchLanguages, fetchListingById } from '../services/listingsService'
import type { Listing } from '../types/listing'
import { Skeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { StoreImage } from '../components/ui/StoreImage'
import { FormSection } from '../components/ui/FormSection'

function formatPay(listing: Listing) {
  const period = listing.payPeriod === 'hourly' ? ' per hour' : ' per month'
  if (listing.payMin === listing.payMax) {
    return `₹${listing.payMin.toLocaleString()}${period}`
  }
  return `₹${listing.payMin.toLocaleString()} – ₹${listing.payMax.toLocaleString()}${period}`
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ios-row flex-row items-center justify-between gap-4">
      <span className="ios-row-label shrink-0">{label}</span>
      <span className="text-right text-[17px] text-kamvala-text">{value}</span>
    </div>
  )
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Listing | null>(null)
  const [jobTypeLabels, setJobTypeLabels] = useState<Record<string, string>>({})
  const [languageLabels, setLanguageLabels] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    Promise.all([
      fetchListingById(id, controller.signal),
      fetchJobTypes(controller.signal),
      fetchLanguages(controller.signal),
    ])
      .then(([data, types, langs]) => {
        setListing(data)
        setJobTypeLabels(Object.fromEntries(types.map((t) => [t.id, t.label])))
        setLanguageLabels(Object.fromEntries(langs.map((l) => [l.id, l.label])))
        setIsLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Could not load job details')
          setIsLoading(false)
        }
      })
    return () => controller.abort()
  }, [id])

  const directionsUrl = listing
    ? `https://www.google.com/maps/dir/?api=1&destination=${listing.location.lat},${listing.location.lng}`
    : '#'

  return (
    <div className="ios-screen flex h-full flex-col">
      <header className="flex shrink-0 items-center border-b border-black/5 bg-white/90 px-2 py-2 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="flex items-center gap-0.5 px-2 py-1 text-[17px] text-kamvala-blue"
          aria-label="Back to explore"
        >
          <span className="text-xl leading-none">‹</span> Explore
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        {isLoading ? (
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error || !listing ? (
          <div className="py-12 text-center">
            <p className="text-[15px] text-kamvala-muted">{error ?? 'Job not found'}</p>
            <Link to="/explore" className="mt-4 inline-block text-[17px] text-kamvala-blue">
              Back to explore
            </Link>
          </div>
        ) : (
          <article>
            {listing.storeImage && (
              <StoreImage
                shopName={listing.shopName}
                storeImage={listing.storeImage}
                size="lg"
                className="w-full rounded-none"
              />
            )}

            <div className="px-4 pt-4">
              <h1 className="text-[28px] font-bold leading-tight">{listing.title}</h1>
              <p className="mt-1 text-[15px] text-kamvala-muted">{listing.shopName}</p>
            </div>

            <div className="mt-4">
              <FormSection title="Details">
                <InfoRow label="Pay" value={formatPay(listing)} />
                <InfoRow
                  label="Work type"
                  value={listing.jobTypes.map((t) => jobTypeLabels[t] ?? t).join(', ')}
                />
                <InfoRow
                  label="Languages"
                  value={listing.languages.map((l) => languageLabels[l] ?? l).join(', ')}
                />
                <div className="ios-row">
                  <span className="ios-row-label">Location</span>
                  <p className="text-[17px] leading-snug">{listing.location.address}</p>
                </div>
                <div className="ios-row">
                  <span className="ios-row-label">About</span>
                  <p className="text-[17px] leading-relaxed">{listing.description}</p>
                </div>
                <div className="ios-row flex-row items-center justify-between">
                  <span className="ios-row-label">Contact</span>
                  <a href={`tel:${listing.contactPhone}`} className="text-[17px] font-medium text-kamvala-blue">
                    {listing.contactPhone}
                  </a>
                </div>
              </FormSection>
            </div>

            <div className="mt-2 space-y-3 px-4">
              <Button fullWidth onClick={() => window.open(directionsUrl, '_blank')}>
                Get Directions
              </Button>
              <Button fullWidth variant="secondary" onClick={() => window.open(`tel:${listing.contactPhone}`)}>
                Call Shop
              </Button>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
