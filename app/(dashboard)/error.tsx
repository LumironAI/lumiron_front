"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
      <p className="text-gray-600 mb-6">{error.message || "Une erreur inattendue s'est produite."}</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Réessayer</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Rafraîchir la page
        </Button>
      </div>
    </div>
  )
}
