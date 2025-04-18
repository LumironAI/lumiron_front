import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  console.log("🔍 Middleware running for path:", req.nextUrl.pathname)
  const res = NextResponse.next()

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient({ req, res })

  // Get session but don't redirect - let client handle it
  console.log("🔍 Getting session in middleware")
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error("❌ Error getting session in middleware:", error)
  }

  // Log authentication status but don't redirect
  const isAuthenticated = !!session
  console.log("🔑 Authentication status:", { isAuthenticated })

  // Return the response without redirects
  console.log("✅ Middleware completed for path:", req.nextUrl.pathname)
  return res
}

// Configure routes for middleware execution
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
