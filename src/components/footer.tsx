import type { Session } from "next-auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LogoLinkHome } from "~/components/logo-link-home";
import { auth } from "~/libs/auth";
import { isAllowed, type PermissionKey } from "~/libs/auth/menus";
import { env } from "~/env";
import { getStoreForCurrentHost } from "~/libs/stores/server";

type AuthenticatedFooterLink = {
  label: string;
  href: string;
  requiresAuth?: boolean;
};

type AuthorizedFooterLink = {
  label: string;
  href: string;
  authTag: PermissionKey;
};

type FooterLink = AuthenticatedFooterLink | AuthorizedFooterLink;

type FooterColumn = {
  title: string;
  href?: string;
  links: FooterLink[];
};

export default async function Footer() {
  const t = await getTranslations();

  const [session, store] = await Promise.all([
    auth(),
    getStoreForCurrentHost(),
  ]);

  const isAuthenticated = !!session?.user;

  const columns: FooterColumn[] = [
    {
      title: isAuthenticated ? t("Footer.restricted") : t("UserMenu.login"),
      href: "/login",
      links: [
        {
          label: t("AccountPage.title"),
          href: "/account",
          requiresAuth: true,
        },
        {
          label: t("AdminPage.title"),
          href: "/admin",
          authTag: "store",
        },
      ],
    },
  ];

  const appVersion = `v${env.NEXT_PUBLIC_APP_VERSION}`;
  const permissions = session?.user.permissions;
  const scopedPermissions = store
    ? [
        ...(permissions?.platform ?? []),
        ...(permissions?.stores[store.id] ?? []),
      ]
    : (permissions?.platform ?? []);

  return (
    <footer className="bg-muted w-dvw">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-8 sm:grid-cols-2 sm:px-6">
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-foreground text-sm font-bold tracking-wide uppercase">
              {column.href ? (
                <Link href={column.href}>{column.title}</Link>
              ) : (
                column.title
              )}
            </h2>
            <span
              className="bg-border mt-2 block h-px w-8"
              aria-hidden="true"
            />
            <ul className="mt-6 flex flex-col gap-4">
              {column.links
                .filter((link) =>
                  checkPermission(link, session?.user, scopedPermissions),
                )
                .map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        ))}
        <div className="flex flex-col items-start justify-between gap-2 lg:items-end">
          <LogoLinkHome
            className="mt-2 flex-col [&>p]:text-sm"
            variant="small"
          />
          <p className="text-muted-foreground text-xs">{appVersion}</p>
        </div>
      </div>
    </footer>
  );
}

function checkPermission(
  link: FooterLink,
  user: Session["user"] | undefined,
  permissions: PermissionKey[],
) {
  const requiredAuth = "requiresAuth" in link && link.requiresAuth;

  const hasAuthTag = "authTag" in link;

  if (!requiredAuth && !hasAuthTag) return true;

  if (requiredAuth && !!user) return true;

  if (hasAuthTag && isAllowed(link.authTag, permissions))
    return true;

  return false;
}
