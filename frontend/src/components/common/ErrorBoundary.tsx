import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="min-h-screen flex items-center justify-center p-8 bg-surface-soft"
      >
        <div className="max-w-md w-full p-8 border border-border rounded-xl bg-surface shadow-sm text-center">
          <p className="m-0 mb-3 text-xs font-bold text-red-500 uppercase tracking-widest">
            Error inesperado
          </p>
          <h2 className="m-0 mb-2 text-xl font-bold">Algo salió mal</h2>
          <p className="m-0 mb-6 text-muted text-sm">
            {this.state.error?.message ?? 'Se produjo un error en la interfaz.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
