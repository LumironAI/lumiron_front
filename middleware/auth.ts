import { type NextRequest, NextResponse } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/agents", "/dashboard", "/appels-entrants", "/appels-sortants"]

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the user has an auth token
  const token = request.cookies.get("auth-token")?.value
  const isAuthenticated = !!token

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access a public route, redirect to dashboard
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/agents", request.url))
  }

  // If the user is not authenticated and accessing the root, redirect to login
  if (!isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
