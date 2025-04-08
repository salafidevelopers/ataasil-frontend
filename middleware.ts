import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define route groups
const authRoutes = ["/auth/login", "/auth/register"];
const protectedRoutes = ["/dashboard", "/admin", "/profile"];
const publicRoutes = ["/", "/courses", "/certificates/verify"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token")?.value;
  const isAuthenticated = !!authToken;

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // For admin routes, check if user is admin (we can't do this in middleware directly,
  // but we'll keep the protected route check above to at least ensure they're authenticated)

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except for static files, api routes, and _next
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
