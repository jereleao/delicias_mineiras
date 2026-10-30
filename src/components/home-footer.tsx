import type { Session } from "next-auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LogoLinkHome } from "~/components/logo-link-home";
import { auth } from "~/libs/auth";
import { isAllowed, type PermissionKey } from "~/libs/auth/menus";
import {
  getStoreScopedPermissions,
  hasStoreForCurrentHost,
} from "~/libs/stores/server";
import { FooterLine } from "./footer-line";

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

export default async function HomeFooter() {
  const t = await getTranslations();

  const session = await auth();

  const permissions = await getStoreScopedPermissions();
  const hasStore = await hasStoreForCurrentHost();

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
        // {
        //   label: t("AdminPage.title"),
        //   href: "/admin",
        //   authTag: "store",
        // },
      ],
    },
  ];

  if (!hasStore) {
    columns[0]?.links.push({
      label: t("NavigationMenu.stores"),
      href: "/stores",
      authTag: "stores",
    });
  }

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
                  checkPermission(link, session?.user, permissions),
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
        </div>
      </div>
      <FooterLine />
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

  if (hasAuthTag && isAllowed(link.authTag, permissions)) return true;

  return false;
}
