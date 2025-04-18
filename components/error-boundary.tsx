"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
    // Here, you could send the error to a monitoring service
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
            <p className="text-gray-600 mb-6">{this.state.error?.message || "Une erreur inattendue s'est produite."}</p>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()}>Rafraîchir la page</Button>
              <Button variant="outline" onClick={this.handleReset}>
                Réessayer
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
