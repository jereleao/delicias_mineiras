import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "./env";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const isProd = env.NODE_ENV === "production";

  try {
    const token = await getToken({
      req: request,
      secret: env.AUTH_SECRET,
      cookieName: `${isProd ? "__Secure-" : ""}authjs.session-token`,
    });

    // Define protected routes
    const protectedRoutes = ["/admin", "/account"];

    // Check if the requested path is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      url.pathname.startsWith(route),
    );

    if (!isProtectedRoute) {
      return NextResponse.next();
    }

    if (!token) {
      console.info("Redirected in the middleware, reason: missing token");

      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.debug("TODO: Redirerect to a error page");
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
