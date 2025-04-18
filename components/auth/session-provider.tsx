"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
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
  // Ref to track if session has been checked
  const sessionCheckedRef = useRef(false)
  // Ref to track if a redirect is in progress
  const redirectInProgressRef = useRef(false)
  // Ref to track the last authenticated state to prevent unnecessary redirects
  const lastAuthStateRef = useRef<boolean | null>(null)

  // Check session only once on initial load
  useEffect(() => {
    console.log("🔄 SessionProvider useEffect running")

    // Only check session once
    if (sessionCheckedRef.current) {
      console.log("⏭️ Session already checked, skipping")
      return
    }

    const checkSession = async () => {
      try {
        console.log("🔍 Checking session")
        await refreshSession()
        // Mark session as checked
        sessionCheckedRef.current = true
      } catch (error) {
        console.error("❌ Error checking session:", error)
      } finally {
        console.log("✅ Session check completed")
        setIsInitializing(false)
      }
    }

    checkSession()
  }, [refreshSession])

  // Update the redirect effect to use isAuthenticated
  useEffect(() => {
    // Skip if still initializing or loading
    if (isInitializing || isLoading) {
      console.log("⏳ Still initializing or loading, skipping redirect check")
      return
    }

    // Skip if a redirect is already in progress
    if (redirectInProgressRef.current) {
      console.log("⏭️ Redirect already in progress, skipping")
      return
    }

    // Use the stable isAuthenticated state from context

    // Skip if auth state hasn't changed
    if (lastAuthStateRef.current === isAuthenticated) {
      return
    }

    // Update last auth state
    lastAuthStateRef.current = isAuthenticated

    const isAuthRoute =
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/register") ||
      pathname?.startsWith("/forgot-password") ||
      pathname?.startsWith("/reset-password")

    console.log("🛣️ Checking redirect conditions:", {
      isAuthenticated,
      isAuthRoute,
      pathname,
    })

    // Add a small delay to ensure state is stable before redirecting
    const redirectTimer = setTimeout(() => {
      if (!isAuthenticated && !isAuthRoute && pathname !== "/") {
        // User is not authenticated and trying to access a protected route
        console.log("🔄 Redirecting to /login from protected route:", pathname)
        redirectInProgressRef.current = true
        router.push("/login")
      } else if (isAuthenticated && isAuthRoute) {
        // User is authenticated and trying to access an auth route
        console.log("🔄 Redirecting to /agents from auth route:", pathname)
        redirectInProgressRef.current = true
        router.push("/agents")
      }

      // Reset redirect flag after a delay
      setTimeout(() => {
        redirectInProgressRef.current = false
      }, 1000)
    }, 100)

    return () => clearTimeout(redirectTimer)
  }, [isAuthenticated, isInitializing, isLoading, pathname, router])

  // Show loading spinner during initialization
  if (isInitializing || isLoading) {
    console.log("⏳ Showing loading spinner")
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  console.log("✅ SessionProvider rendering children")
  return <>{children}</>
}
