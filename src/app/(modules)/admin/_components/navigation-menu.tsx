import * as React from "react";

import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { isAllowed, MENUS, type MenuKey } from "~/libs/auth/menus";
import { getTranslations } from "next-intl/server";
import { auth } from "~/libs/auth";

type AdminNavigationMenuProps = Readonly<{
  className?: string;
}>;

export async function AdminNavigationMenu({
  className,
}: AdminNavigationMenuProps) {
  const t = await getTranslations("NavigationMenu");

  const session = await auth();

  const allowedMenus = MENUS.map(({ menuGroup, menus }) => ({
    menuGroup,
    menus: menus.filter(({ menuKey }) =>
      isAllowed(menuKey, session?.user.permissions ?? []),
    ),
  })).filter(({ menus }) => menus.length > 0);

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {allowedMenus.map((menu) => (
          <NavigationMenuItem key={menu.menuGroup}>
            <NavigationMenuTrigger>{t(menu.menuGroup)}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96 py-1">
                {menu.menus.map((subMenu) => (
                  <SubMenu key={subMenu.menuKey + subMenu.href} {...subMenu} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type SubMenuProps = Readonly<{
  menuKey: MenuKey;
  href: string;
}>;

async function SubMenu({ menuKey, href }: SubMenuProps) {
  const t = await getTranslations("NavigationMenu");

  type tKeys = Parameters<typeof t>[0];

  const tKeyDescription = `${menuKey}-description` as tKeys;

  return (
    <ListItem href={href} title={t(menuKey)}>
      {t.has(tKeyDescription) ? t(tKeyDescription) : null}
    </ListItem>
  );
}
