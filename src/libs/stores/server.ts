import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "~/libs/db";
import { storeDomains, stores } from "~/libs/db/schema";
import { auth } from "~/libs/auth";
import { env } from "~/env";

export function normalizeHostname(rawHost: string): string | undefined {
  try {
    const parsedHost = new URL(`http://${rawHost}`);
    const hostname = parsedHost.hostname.toLowerCase().replace(/\.$/, "");

    return parsedHost.port ? `${hostname}:${parsedHost.port}` : hostname;
  } catch {
    return undefined;
  }
}

export function getRequestHost(requestHeaders: Headers): string | undefined {
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const rawHost =
    forwardedHost?.split(",")[0]?.trim() || requestHeaders.get("host")?.trim();

  return rawHost || undefined;
}

function getStoreSlugFromHostname(hostname: string): string | undefined {
  const hostnameParts = hostname.split(".");
  const slugIndex = hostnameParts[0] === "www" ? 1 : 0;
  const slug = hostnameParts[slugIndex];

  return slug && hostnameParts.length > slugIndex + 1 ? slug : undefined;
}

export async function getStoreForHostname(
  hostname: string,
  database: typeof db = db,
) {
  console.info(`Search ${hostname}`);

  const storeByDomain = await database
    .select({
      id: stores.id,
      name: stores.name,
      slug: stores.slug,
      active: stores.active,
      createdAt: stores.createdAt,
      updatedAt: stores.updatedAt,
    })
    .from(storeDomains)
    .innerJoin(stores, eq(storeDomains.storeId, stores.id))
    .where(
      and(
        sql`lower(${storeDomains.domain}) = ${hostname}`,
        eq(stores.active, true),
      ),
    )
    .limit(1)
    .then((rows) => rows[0]);

  if (storeByDomain) return storeByDomain;

  const slug = getStoreSlugFromHostname(hostname);
  if (!slug) return undefined;

  return database
    .select({
      id: stores.id,
      name: stores.name,
      slug: stores.slug,
      active: stores.active,
      createdAt: stores.createdAt,
      updatedAt: stores.updatedAt,
    })
    .from(stores)
    .where(and(sql`lower(${stores.slug}) = ${slug}`, eq(stores.active, true)))
    .limit(1)
    .then((rows) => rows[0]);
}

export async function hasStoreForCurrentHost(): Promise<boolean> {
  return Boolean(await getStoreForCurrentHost());
}

export async function getStoreForCurrentHost() {
  const requestHeaders = await headers();
  const rawHost = getRequestHost(requestHeaders);
  if (!rawHost) return undefined;

  const hostname = normalizeHostname(rawHost);
  if (!hostname) return undefined;

  return getStoreForHostname(hostname);
}

export async function getStoreScopedPermissions() {
  const session = await auth();

  const isAuthenticated = !!session?.user;

  if (!isAuthenticated) return [];

  const permissions = session.user.permissions;

  const store = await getStoreForCurrentHost();

  const plataformPermissions = permissions?.platform ?? [];
  const storePermissions = store ? (permissions?.stores[store.id] ?? []) : [];

  const scopedPermissions = [...plataformPermissions, ...storePermissions];

  return scopedPermissions;
}

export async function getLoginUrl() {
  const headersList = await headers();

  // Extracts the hostname (e.g., "example.com" or "localhost:3000")
  const host = headersList.get("host");

  // Use 'x-forwarded-host' if your app sits behind a reverse proxy like Vercel, Cloudflare, or Nginx
  const forwardedHost = headersList.get("x-forwarded-host");

  const authOrigin = new URL(env.AUTH_URL);
  const requestHost =
    forwardedHost?.split(",")[0]?.trim() || host || authOrigin.host;
  const loginUrl = new URL("/login", authOrigin);

  if (requestHost.toLowerCase() !== authOrigin.host.toLowerCase()) {
    const forwardedProto = headersList
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const protocol =
      forwardedProto === "http" || forwardedProto === "https"
        ? `${forwardedProto}:`
        : authOrigin.protocol;
    try {
      const callbackUrl = new URL(`${protocol}//${requestHost}`);
      const isAllowedHost =
        callbackUrl.hostname === authOrigin.hostname ||
        callbackUrl.hostname.endsWith(`.${authOrigin.hostname}`);

      if (
        isAllowedHost &&
        callbackUrl.protocol === authOrigin.protocol &&
        callbackUrl.port === authOrigin.port &&
        !callbackUrl.username &&
        !callbackUrl.password
      ) {
        loginUrl.searchParams.set("callbackUrl", callbackUrl.origin);
      }
    } catch (error) {
      console.error("Could not build the tenant login callback URL:", error);
    }
  }

  return loginUrl;
}
