import { useEffect, useState } from 'react'
import { fetchJobTypes, fetchLanguages } from '../../services/listingsService'
import { useFilterContext } from '../../context/FilterContext'

export function FilterBar() {
  const { filters, setJobType, setLanguage, setMinPay, clearFilters } = useFilterContext()
  const [jobTypes, setJobTypes] = useState<{ id: string; label: string }[]>([])
  const [languages, setLanguages] = useState<{ id: string; label: string }[]>([])

  useEffect(() => {
    fetchJobTypes().then(setJobTypes).catch(() => {})
    fetchLanguages().then(setLanguages).catch(() => {})
  }, [])

  const hasFilters = filters.jobType || filters.language || filters.minPay

  const pillClass = (active: boolean) =>
    `shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
      active
        ? 'bg-kamvala-blue text-white'
        : 'bg-kamvala-gray text-kamvala-text'
    }`

  return (
    <div className="shrink-0 bg-white px-4 py-2" aria-label="Job filters">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <select
          aria-label="Filter by job type"
          value={filters.jobType ?? ''}
          onChange={(e) => setJobType(e.target.value || null)}
          className={`${pillClass(!!filters.jobType)} appearance-none outline-none`}
        >
          <option value="">All types</option>
          {jobTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        <select
          aria-label="Filter by language"
          value={filters.language ?? ''}
          onChange={(e) => setLanguage(e.target.value || null)}
          className={`${pillClass(!!filters.language)} appearance-none outline-none`}
        >
          <option value="">All languages</option>
          {languages.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>

        <select
          aria-label="Minimum pay filter"
          value={filters.minPay ?? ''}
          onChange={(e) => setMinPay(e.target.value ? Number(e.target.value) : null)}
          className={`${pillClass(filters.minPay !== null)} appearance-none outline-none`}
        >
          <option value="">Any pay</option>
          <option value="10000">₹10,000+</option>
          <option value="15000">₹15,000+</option>
          <option value="20000">₹20,000+</option>
        </select>

        {hasFilters && (
          <button type="button" onClick={clearFilters} className={pillClass(false)}>
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export function useJobTypeLabels() {
  const [labels, setLabels] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchJobTypes()
      .then((types) => {
        setLabels(Object.fromEntries(types.map((t) => [t.id, t.label])))
      })
      .catch(() => {})
  }, [])

  return labels
}
