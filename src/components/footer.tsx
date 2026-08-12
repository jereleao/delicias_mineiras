"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

type FooterLink = {
  label: string;
  href: string;
  requiresAuth?: boolean;
};

type FooterColumn = {
  title: string;
  href?: string;
  links: FooterLink[];
};

export default function Footer() {
  const t = useTranslations();

  const columns: FooterColumn[] = useMemo(() => {
    return [
      {
        title: "Institucional",
        links: [
          { label: t("AboutPage.title"), href: "/about" },
          { label: t("ContactPage.title"), href: "/contact" },
        ],
      },
      {
        title: "Entrar",
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
            requiresAuth: true,
          },
        ],
      },
    ];
  }, [t]);

  const { status } = useSession();

  return (
    <footer className="bg-muted container mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
                .filter(
                  (link) => !link.requiresAuth || status === "authenticated",
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
      </div>
    </footer>
  );
}
