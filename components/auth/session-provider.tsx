"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation" // Remove useSearchParams
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { isLoading, user, session, refreshSession, isAuthenticated } = useAuth()
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  // Remove searchParams initialization
  // Remove unused refs
  // const sessionCheckedRef = useRef(false)
  // const redirectInProgressRef = useRef(false)
  // const lastAuthStateRef = useRef<boolean | null>(null)

  // Remove the redundant initial session check useEffect from SessionProvider.
  // AuthProvider now handles the initial load and isLoading state.
  // The isInitializing state is no longer needed here as AuthProvider's isLoading covers it.

  // Show loading spinner based *only* on AuthProvider's isLoading state
  if (isLoading) { // Rely solely on isLoading from useAuth()
    console.log("⏳ Showing loading spinner (from AuthProvider state)")
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  console.log("✅ SessionProvider rendering children")
  return <>{children}</>
}
