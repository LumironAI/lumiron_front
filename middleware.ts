import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
// Remove import for separate authMiddleware
// import { authMiddleware } from "./middleware/auth"
import type { Session } from "@supabase/supabase-js"

// Define routes directly in the main middleware for consolidated logic
const protectedRoutes = ["/dashboard/agents", "/dashboard", "/dashboard/appels-entrants", "/dashboard/appels-sortants", "/dashboard/historique-entrants", "/dashboard/historique-sortants", "/dashboard/agents-sortants", "/dashboard/campagnes", "/dashboard/leads"]
const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]


export async function middleware(req: NextRequest) {
  console.log("🔍 Middleware running for path:", req.nextUrl.pathname)

  // Create response object early; getSession might need to set cookies on it
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get session
  console.log("🔍 Getting session in middleware")
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("❌ Error getting session in middleware:", sessionError)
    // Treat errors as unauthenticated for safety
  }
  // Add detailed logging for the session object and error
  console.log("🔒 Middleware session object:", JSON.stringify(session, null, 2));
  console.log("🔒 Middleware session error:", sessionError);

  // Also try getUser for comparison/debugging
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log("🔒 Middleware user object:", JSON.stringify(user, null, 2));
  console.log("🔒 Middleware user error:", userError);


  // Base authentication check primarily on session presence
  const isAuthenticated = !!session
  console.log("🔑 Session retrieved:", { exists: isAuthenticated })

  const { pathname } = req.nextUrl

  // Check route types
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // 1. Redirect authenticated users from public routes
  if (isAuthenticated && isPublicRoute) {
    console.log(`🚪 Middleware: Authenticated user on public route (${pathname}). Redirecting to /dashboard/agents`)
    return NextResponse.redirect(new URL("/dashboard/agents", req.url))
  }

  // 2. Redirect unauthenticated users from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    console.log(`🚪 Middleware: Unauthenticated user on protected route (${pathname}). Redirecting to /login`)
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("from", pathname) // Preserve original destination
    return NextResponse.redirect(redirectUrl)
  }

  // 3. Redirect unauthenticated users from root to login
  if (!isAuthenticated && pathname === "/") {
    console.log("🚪 Middleware: Unauthenticated user on root. Redirecting to /login")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 4. If none of the above apply, allow the request and return the original response object
  // This response object might have been modified by getSession() to include necessary cookies.
  console.log(`✅ Middleware finished (no redirect). Path: ${pathname}`)
  return res
}

// Configure routes for middleware execution
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
