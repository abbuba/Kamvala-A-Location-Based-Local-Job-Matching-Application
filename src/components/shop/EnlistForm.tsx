import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createListing, fetchJobTypes, fetchLanguages } from '../../services/listingsService'
import type { CreateListingInput, PayPeriod } from '../../types/listing'
import { MAX_STORE_IMAGE_BYTES } from '../../types/listing'
import { useLocationContext } from '../../context/LocationContext'
import { useListingsContext } from '../../context/ListingsContext'
import { useFilterContext } from '../../context/FilterContext'
import { Button } from '../ui/Button'
import { FormRow, FormSection } from '../ui/FormSection'
import { StoreImage } from '../ui/StoreImage'
import { MapPinPicker } from './MapPinPicker'

interface FormErrors {
  shopName?: string
  title?: string
  jobTypes?: string
  languages?: string
  payMin?: string
  payMax?: string
  address?: string
  description?: string
  contactPhone?: string
  storeImage?: string
}

const initialForm = {
  shopName: '',
  title: '',
  jobTypes: [] as string[],
  languages: [] as string[],
  payMin: '',
  payMax: '',
  payPeriod: 'monthly' as PayPeriod,
  address: '',
  description: '',
  contactPhone: '',
  storeImage: '' as string | undefined,
}

export function EnlistForm() {
  const navigate = useNavigate()
  const { center, setCenter } = useLocationContext()
  const { addListing, refreshListings } = useListingsContext()
  const { clearFilters } = useFilterContext()
  const [form, setForm] = useState(initialForm)
  const [pin, setPin] = useState(center)
  const pinTouched = useRef(false)
  const [jobTypes, setJobTypes] = useState<{ id: string; label: string }[]>([])
  const [languages, setLanguages] = useState<{ id: string; label: string }[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchJobTypes().then(setJobTypes).catch(() => {})
    fetchLanguages().then(setLanguages).catch(() => {})
  }, [])

  useEffect(() => {
    if (!pinTouched.current) {
      setPin(center)
    }
  }, [center.lat, center.lng])

  const updatePin = (coords: typeof center) => {
    pinTouched.current = true
    setPin(coords)
  }

  const toggleArrayValue = (field: 'jobTypes' | 'languages', value: string) => {
    setForm((prev) => {
      const arr = prev[field]
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...prev, [field]: next }
    })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_STORE_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, storeImage: 'Image must be under 500 KB' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, storeImage: reader.result as string }))
      setErrors((prev) => ({ ...prev, storeImage: undefined }))
    }
    reader.readAsDataURL(file)
  }

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!form.shopName.trim()) next.shopName = 'Required'
    if (!form.title.trim()) next.title = 'Required'
    if (form.jobTypes.length === 0) next.jobTypes = 'Select at least one'
    if (form.languages.length === 0) next.languages = 'Select at least one'
    if (!form.payMin || Number(form.payMin) <= 0) next.payMin = 'Invalid'
    if (!form.payMax || Number(form.payMax) <= 0) next.payMax = 'Invalid'
    if (Number(form.payMax) < Number(form.payMin)) next.payMax = 'Must be ≥ min'
    if (!form.address.trim()) next.address = 'Required'
    if (!form.description.trim()) next.description = 'Required'
    if (!form.contactPhone.trim()) next.contactPhone = 'Required'
    return next
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const input: CreateListingInput = {
        shopName: form.shopName.trim(),
        title: form.title.trim(),
        jobTypes: form.jobTypes,
        languages: form.languages,
        payMin: Number(form.payMin),
        payMax: Number(form.payMax),
        payPeriod: form.payPeriod,
        location: { ...pin, address: form.address.trim() },
        description: form.description.trim(),
        contactPhone: form.contactPhone.trim(),
        ...(form.storeImage ? { storeImage: form.storeImage } : {}),
      }
      const created = await createListing(input)

      addListing(created)
      setCenter(pin)
      clearFilters()
      refreshListings()
      navigate('/explore')
    } catch {
      setErrors({ shopName: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormSection title="Shop">
        <FormRow label="Shop name" error={errors.shopName}>
          <input
            className="ios-field"
            value={form.shopName}
            onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            placeholder="Charminar Kirana"
          />
        </FormRow>
        <div className="ios-row">
          <span className="ios-row-label">Store photo</span>
          <div className="flex items-center gap-4">
            <StoreImage shopName={form.shopName || 'Shop'} storeImage={form.storeImage} />
            <label className="cursor-pointer text-[15px] font-medium text-kamvala-blue">
              Choose photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          {errors.storeImage && <p className="text-[13px] text-red-500">{errors.storeImage}</p>}
        </div>
      </FormSection>

      <FormSection title="Job">
        <FormRow label="Job title" error={errors.title}>
          <input
            className="ios-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Shop Assistant"
          />
        </FormRow>
        <div className="ios-row">
          <span className="ios-row-label">Work type</span>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleArrayValue('jobTypes', t.id)}
                aria-pressed={form.jobTypes.includes(t.id)}
                className="ios-chip"
              >
                {t.label}
              </button>
            ))}
          </div>
          {errors.jobTypes && <p className="text-[13px] text-red-500">{errors.jobTypes}</p>}
        </div>
        <div className="ios-row">
          <span className="ios-row-label">Languages</span>
          <div className="flex flex-wrap gap-2">
            {languages.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => toggleArrayValue('languages', l.id)}
                aria-pressed={form.languages.includes(l.id)}
                className="ios-chip"
              >
                {l.label}
              </button>
            ))}
          </div>
          {errors.languages && <p className="text-[13px] text-red-500">{errors.languages}</p>}
        </div>
      </FormSection>

      <FormSection title="Pay">
        <FormRow label="Minimum" error={errors.payMin}>
          <input
            className="ios-field"
            type="number"
            value={form.payMin}
            onChange={(e) => setForm({ ...form, payMin: e.target.value })}
            placeholder="₹10,000"
            min={0}
          />
        </FormRow>
        <FormRow label="Maximum" error={errors.payMax}>
          <input
            className="ios-field"
            type="number"
            value={form.payMax}
            onChange={(e) => setForm({ ...form, payMax: e.target.value })}
            placeholder="₹15,000"
            min={0}
          />
        </FormRow>
        <div className="ios-row">
          <span className="ios-row-label">Period</span>
          <div className="ios-segmented">
            {(['monthly', 'hourly'] as PayPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={form.payPeriod === p}
                className="ios-segment capitalize"
                onClick={() => setForm({ ...form, payPeriod: p })}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection title="Location" footer="Tap the map or drag the pin to set your shop location.">
        <FormRow label="Address" error={errors.address}>
          <input
            className="ios-field"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Street, area, Hyderabad"
          />
        </FormRow>
        <div className="ios-row !p-0 overflow-hidden">
          <MapPinPicker center={pin} onChange={updatePin} />
        </div>
      </FormSection>

      <FormSection title="Details">
        <FormRow label="Description" error={errors.description}>
          <textarea
            className="ios-textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the role, hours, and requirements"
          />
        </FormRow>
        <FormRow label="Contact phone" error={errors.contactPhone}>
          <input
            className="ios-field"
            type="tel"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </FormRow>
      </FormSection>

      <div className="px-4 pb-6">
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'List My Shop'}
        </Button>
      </div>
    </form>
  )
}
