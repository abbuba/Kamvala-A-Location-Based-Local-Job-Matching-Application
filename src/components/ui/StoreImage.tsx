interface StoreImageProps {
  shopName: string
  storeImage?: string
  size?: 'sm' | 'lg'
  className?: string
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function StoreImage({ shopName, storeImage, size = 'sm', className = '' }: StoreImageProps) {
  const sizeClass = size === 'lg' ? 'h-40 w-full rounded-2xl' : 'h-12 w-12 shrink-0 rounded-xl'

  if (storeImage) {
    return (
      <img
        src={storeImage}
        alt={`${shopName} storefront`}
        className={`object-cover ${sizeClass} ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center bg-kamvala-gray text-sm font-semibold text-kamvala-muted ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      {initials(shopName)}
    </div>
  )
}
