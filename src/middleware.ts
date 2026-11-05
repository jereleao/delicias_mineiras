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

      const loginUrl = new URL("/login", env.AUTH_URL);
      loginUrl.searchParams.set("callbackUrl", url.toString());
      return NextResponse.redirect(loginUrl);
    }

    if (menuKey.startsWith("store.")) {
      return NextResponse.next();
    }

    const platformPermissions = Array.isArray(token.platformPermissions)
      ? token.platformPermissions
      : [];

    const grantedPermission = isAllowed(menuKey, platformPermissions);

    if (!grantedPermission) {
      console.info(`User dont have permission for the menu: ${menuKey}.`);

      url.pathname = "/auth";
      url.search = "?error=Forbidden";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.debug("TODO: Redirerect to a error page");
    console.error("Middleware error:", error);
    const loginUrl = new URL("/login", env.AUTH_URL);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.toString());
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next/|assets/|.*\\.(?:avif|gif|ico|jpe?g|png|svg|webp)$|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$).*)",
  ],
};
