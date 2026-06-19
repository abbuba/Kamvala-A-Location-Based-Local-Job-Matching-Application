import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = fullWidth ? 'w-full' : ''
  const variants = {
    primary: 'ios-button-primary',
    secondary: 'ios-button-secondary',
    ghost: 'bg-transparent text-kamvala-blue text-[17px] font-normal py-2',
  }

  return (
    <button
      className={`${variants[variant]} ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
