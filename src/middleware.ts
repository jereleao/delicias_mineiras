import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "./env";
import { getMenuKeyByHref, isAllowed } from "./libs/auth/menus";

// Explicit public routes
const publicRoutes = ["/"];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const useSecureCookies = env.NODE_ENV === "production";
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";

  try {
    const token = await getToken({
      req: request,
      secret: env.AUTH_SECRET,
      cookieName: `${cookiePrefix}authjs.session-token`,
      secureCookie: useSecureCookies,
    });

    // Check if the requested path is protected
    const isPublicRoute = publicRoutes.some((route) => url.pathname == route);

    if (isPublicRoute) {
      return NextResponse.next();
    }

    const menuKey = getMenuKeyByHref(url.pathname);

    if (!menuKey) {
      console.info(
        `Menu for ${url.pathname} not found, consider public route.`,
      );

      return NextResponse.next();
    }

    if (!token) {
      console.info("Redirected in the middleware, reason: missing token");

      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const grantedPermission = isAllowed(menuKey, token.permissions);

    if (!grantedPermission) {
      console.info("User dont have permission for this page");

      url.pathname = "/auth";
      url.search = "?error=Forbidden";
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
