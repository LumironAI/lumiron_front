"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ErrorBoundary } from "@/components/error-boundary"
import { useSystemTheme } from "@/hooks/use-system-theme"
import { AuthDebugger } from "@/components/debug/auth-debugger"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // Add the system theme listener
  useSystemTheme()

  console.log("Dashboard layout rendering")

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
          <Toaster />
          <AuthDebugger />
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
