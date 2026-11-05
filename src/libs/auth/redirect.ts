import { and, eq, or, sql } from "drizzle-orm";
import { db } from "~/libs/db";
import { storeDomains, stores } from "~/libs/db/schema";

export async function isAllowedAuthRedirectUrl(
  target: URL,
  authOrigin: URL,
): Promise<boolean> {
  if (
    target.protocol !== authOrigin.protocol ||
    target.username ||
    target.password
  ) {
    return false;
  }

  const isAuthHost =
    target.hostname === authOrigin.hostname ||
    target.hostname.endsWith(`.${authOrigin.hostname}`);

  if (isAuthHost) return target.port === authOrigin.port;

  const isLocalTestHost =
    authOrigin.hostname === "localhost" &&
    target.hostname.endsWith(".localtest.me");
  if (isLocalTestHost) return target.port === authOrigin.port;

  const allowedHosts = [target.host.toLowerCase()];
  if (target.hostname.toLowerCase().startsWith("www.")) {
    const withoutWww = new URL(target);
    withoutWww.hostname = target.hostname.slice(4);
    allowedHosts.push(withoutWww.host.toLowerCase());
  }

  const registeredDomain = await db
    .select({ domain: storeDomains.domain })
    .from(storeDomains)
    .innerJoin(stores, eq(storeDomains.storeId, stores.id))
    .where(
      and(
        eq(stores.active, true),
        or(
          ...allowedHosts.map(
            (host) => sql`lower(${storeDomains.domain}) = ${host}`,
          ),
        ),
      ),
    )
    .limit(1)
    .then((rows) => rows[0]);

  return Boolean(registeredDomain);
}
