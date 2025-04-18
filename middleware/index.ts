import type { NextRequest } from "next/server"
import { authMiddleware } from "./auth"

export function middleware(request: NextRequest) {
  // Execute middlewares in order
  return authMiddleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
