import { type NextRequest, NextResponse } from "next/server"
import type { Session } from "@supabase/supabase-js" // Import Session type

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard/agents", "/dashboard", "/dashboard/appels-entrants", "/dashboard/appels-sortants", "/dashboard/historique-entrants", "/dashboard/historique-sortants", "/dashboard/agents-sortants", "/dashboard/campagnes", "/dashboard/leads"]

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

// Update function signature to accept session
export function authMiddleware(request: NextRequest, session: Session | null) {
  const { pathname } = request.nextUrl

  // Use the passed session object to determine authentication status
  const isAuthenticated = !!session

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access a public route, redirect to dashboard/agents
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard/agents", request.url))
  }

  // If the user is not authenticated and accessing the root, redirect to login
  if (!isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
