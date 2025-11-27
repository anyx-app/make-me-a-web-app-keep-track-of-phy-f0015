import React, { Component, ReactNode, ErrorInfo } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary - Catches React errors and prevents white screen of death
 * 
 * Wrap your app or components to gracefully handle errors
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })
    
    // Send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // window.Sentry?.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                We're sorry, but something unexpected happened. This error has been logged.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Show error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded-lg bg-muted p-4 text-sm font-mono overflow-x-auto">
                  <div className="text-destructive font-bold mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div className="text-muted-foreground whitespace-pre-wrap text-xs">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              )}
              
              {/* Common error explanations */}
              {this.state.error?.message.includes('Minified React error #31') && (
                <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-4">
                  <p className="font-semibold mb-2">Common cause:</p>
                  <p className="text-sm text-muted-foreground">
                    An object was passed where a string or component was expected. 
                    Check that you're passing the correct prop types (e.g., passing 
                    <code className="mx-1 px-1 bg-muted rounded">title="string"</code> not 
                    <code className="mx-1 px-1 bg-muted rounded">title={`{object}`}</code>).
                  </p>
                </div>
              )}
              
              {this.state.error?.message.includes('.map is not a function') && (
                <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-4">
                  <p className="font-semibold mb-2">Common cause:</p>
                  <p className="text-sm text-muted-foreground">
                    A non-array value was passed to a component expecting an array. 
                    Check that array props (like <code className="mx-1 px-1 bg-muted rounded">items</code>) 
                    are actually arrays.
                  </p>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={this.handleReset} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
              
              {/* Help text */}
              <p className="text-xs text-muted-foreground pt-4">
                If this error persists, please contact support with the error details above.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook version for functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}

