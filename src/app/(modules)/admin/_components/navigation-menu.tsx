import * as React from "react";

import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { ADMIN_MENUS } from "./admin-menus";
import { getTranslations } from "next-intl/server";

type AdminNavigationMenuProps = Readonly<{
  className?: string;
}>;

export async function AdminNavigationMenu({
  className,
}: AdminNavigationMenuProps) {
  const t = await getTranslations("NavigationMenu");
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {ADMIN_MENUS.map((menu) => (
          <NavigationMenuItem key={menu.tKeyTitle}>
            <NavigationMenuTrigger>{t(menu.tKeyTitle)}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96 py-1">
                {menu.menus.map((subMenu) => (
                  <ListItem
                    key={subMenu.tKeyTitle + subMenu.href}
                    href={subMenu.href}
                    title={t(subMenu.tKeyTitle)}
                  >
                    {"tKeyDescription" in subMenu
                      ? t(subMenu.tKeyDescription)
                      : null}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
