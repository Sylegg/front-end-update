import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Route protection configuration
const protectedRoutes = {
  "/admin": ["admin"],
  "/dealer": ["dealer_manager", "dealer_staff"],
  "/staff": ["dealer_staff", "dealer_manager", "evm_staff", "admin"],
  "/manager": ["dealer_manager", "evm_staff", "admin"],
  "/customer": ["customer"],
  "/evm": ["evm_staff", "admin"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route needs protection
  const protectedRoute = Object.keys(protectedRoutes).find((route) => pathname.startsWith(route))

  if (protectedRoute) {
    // In a real app, you'd validate the JWT token here
    // For now, we'll redirect to login if no session
    const hasSession = request.cookies.get("auth-session")

    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dealer/:path*", "/staff/:path*", "/manager/:path*", "/customer/:path*", "/evm/:path*"],
}
