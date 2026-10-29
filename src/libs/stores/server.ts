import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "~/libs/db";
import { storeDomains, stores } from "~/libs/db/schema";
import { auth } from "~/libs/auth";

export function normalizeHostname(rawHost: string): string | undefined {
  try {
    const parsedHost = new URL(`http://${rawHost}`);
    const hostname = parsedHost.hostname.toLowerCase().replace(/\.$/, "");

    return parsedHost.port ? `${hostname}:${parsedHost.port}` : hostname;
  } catch {
    return undefined;
  }
}

export async function getStoreForHostname(
  hostname: string,
  database: typeof db = db,
) {
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

  return storeByDomain;
}

export async function hasStoreForCurrentHost(): Promise<boolean> {
  return Boolean(await getStoreForCurrentHost());
}

export async function getStoreForCurrentHost() {
  const requestHeaders = await headers();
  const rawHost = requestHeaders.get("host");
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
