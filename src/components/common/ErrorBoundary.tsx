import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Iconora captured uncaught exception:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-white text-[#0F1116] font-sans">
          <div className="max-w-md w-full p-8 rounded-[24px] bg-[#F7F7F8] border border-[#E7E7EA] shadow-xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-lg font-bold text-[#0F1116] mb-1">
              Something went wrong
            </h2>

            <p className="text-xs text-[#8E8E93] mb-6 leading-relaxed">
              An unexpected error occurred while rendering the workspace. Your saved favorites in local storage remain safe.
            </p>

            {this.state.error && (
              <div className="w-full p-3 rounded-[12px] bg-white border border-[#E7E7EA] text-left text-[11px] font-mono text-[#E11D48] overflow-x-auto mb-6 max-h-28">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F1116] hover:bg-[#1E2028] text-white text-xs font-semibold shadow-xs hover:-translate-y-[1px] active:translate-y-0 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
