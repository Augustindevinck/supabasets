import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/libs/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Early return for static assets to reduce latency
  const pathname = request.nextUrl.pathname;
  
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.includes('/favicon.ico') ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
  ) {
    return NextResponse.next();
  }
  
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
