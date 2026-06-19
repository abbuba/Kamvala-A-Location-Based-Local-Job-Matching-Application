import { Component, type ErrorInfo, type ReactNode } from 'react'
import { MapFallback } from './MapFallback'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Map error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <MapFallback message="Map failed to load. Check your Mapbox token in .env" />
    }
    return this.props.children
  }
}
