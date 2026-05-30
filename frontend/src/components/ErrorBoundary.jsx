import React from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
          <div className="relative max-w-md w-full border rounded-2xl p-6 bg-card shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
            {/* Background blur */}
            <div className="absolute inset-0 bg-primary/5 rounded-2xl filter blur-xl pointer-events-none -z-10"></div>
            
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected error occurred while rendering this section. Our team has been notified.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-muted rounded-xl border text-left font-mono text-[10px] text-muted-foreground/80 overflow-auto max-h-24 select-text">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={this.handleReset} className="w-full sm:w-1/2 gap-1.5">
                <RotateCcw className="w-4 h-4" /> Try Again
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-1/2 gap-1.5">
                <a href="/">
                  <Home className="w-4 h-4" /> Go Home
                </a>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
