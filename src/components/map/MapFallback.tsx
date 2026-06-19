interface MapFallbackProps {
  message?: string
}

export function MapFallback({
  message = 'Map unavailable',
}: MapFallbackProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-kamvala-gray p-6 text-center">
      <p className="text-sm font-medium text-kamvala-text">{message}</p>
      <p className="text-xs text-kamvala-muted">
        Add your Mapbox token to <code className="rounded bg-white px-1">.env</code> as{' '}
        <code className="rounded bg-white px-1">VITE_MAPBOX_TOKEN</code>
      </p>
      <a
        href="https://account.mapbox.com/"
        target="_blank"
        rel="noreferrer"
        className="text-xs font-medium text-kamvala-blue"
      >
        Get a free token at mapbox.com
      </a>
    </div>
  )
}
