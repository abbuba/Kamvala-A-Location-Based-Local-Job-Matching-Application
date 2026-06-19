/// <reference types="vite/client" />

declare module '*?worker' {
  const WorkerFactory: new (options?: { name?: string }) => Worker
  export default WorkerFactory
}

declare module '*?url' {
  const url: string
  export default url
}

declare module 'mapbox-gl/dist/mapbox-gl-csp.js' {
  import mapboxgl from 'mapbox-gl'
  export default mapboxgl
}
