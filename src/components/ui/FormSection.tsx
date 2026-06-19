import type { ReactNode } from 'react'

interface FormSectionProps {
  title?: string
  footer?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, footer, children, className = '' }: FormSectionProps) {
  return (
    <section className={`mb-6 ${className}`}>
      {title && <h3 className="ios-section-header">{title}</h3>}
      <div className="ios-group">{children}</div>
      {footer && (
        <p className="mt-2 px-4 text-[13px] leading-snug text-kamvala-muted">{footer}</p>
      )}
    </section>
  )
}

interface FormRowProps {
  label: string
  children: ReactNode
  error?: string
}

export function FormRow({ label, children, error }: FormRowProps) {
  return (
    <div className="ios-row">
      <label className="ios-row-label">{label}</label>
      {children}
      {error && (
        <p className="text-[13px] text-red-500" role="alert">{error}</p>
      )}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  large?: boolean
}

export function PageHeader({ title, subtitle, large = true }: PageHeaderProps) {
  return (
    <header className="shrink-0 px-4 pb-3 pt-2">
      <h1 className={large ? 'ios-large-title' : 'text-[17px] font-semibold'}>{title}</h1>
      {subtitle && <p className="ios-subtitle">{subtitle}</p>}
    </header>
  )
}
