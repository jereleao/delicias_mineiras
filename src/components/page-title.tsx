"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getMenuKeyByHref } from "~/libs/auth/menus";

export function PageTitle() {
  const pathname = usePathname();

  const menuKey = getMenuKeyByHref(pathname);

  const t = useTranslations("NavigationMenu");

  type tKeys = Parameters<typeof t>[0];

  if (!t.has(menuKey as tKeys)) return null;

  return <h1>{t(menuKey as tKeys)}</h1>;
}
