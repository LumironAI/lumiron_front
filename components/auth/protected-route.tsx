"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  console.log("ProtectedRoute:", { user, isLoading, isAuthenticated })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("ProtectedRoute: redirecting to login")
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    console.log("ProtectedRoute: loading")
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: no authenticated user")
    return null
  }

  console.log("ProtectedRoute: rendering children")
  return <>{children}</>
}
