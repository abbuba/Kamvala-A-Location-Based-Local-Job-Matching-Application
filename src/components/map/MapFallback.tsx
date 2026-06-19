interface MapFallbackProps {
  message?: string
}

export function MapFallback({
  message = 'Map unavailable',
}: MapFallbackProps) {
  const hasToken = Boolean(import.meta.env.VITE_MAPBOX_TOKEN)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-kamvala-gray p-6 text-center">
      <p className="text-sm font-medium text-kamvala-text">{message}</p>
      {!hasToken ? (
        <>
          <p className="text-xs text-kamvala-muted">
            Mapbox token missing from the build. Add{' '}
            <code className="rounded bg-white px-1">VITE_MAPBOX_TOKEN</code> as a GitHub Actions secret,
            or in <code className="rounded bg-white px-1">.env</code> for local dev.
          </p>
          <a
            href="https://account.mapbox.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-kamvala-blue"
          >
            Get a free token at mapbox.com
          </a>
        </>
      ) : (
        <p className="text-xs text-kamvala-muted">
          Token is set but tiles did not load. In Mapbox → your token → URL restrictions, allow{' '}
          <code className="rounded bg-white px-1">https://abbuba.github.io/*</code> and{' '}
          <code className="rounded bg-white px-1">http://localhost:*/*</code>, then redeploy.
        </p>
      )}
    </div>
  )
}
