import * as React from "react";

import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import {
  getPathByMenuKey,
  type MenuGroup,
  type MenuKey,
} from "~/libs/auth/menus";
import { getTranslations } from "next-intl/server";

type GenericMenuGroup = {
  menuGroup: MenuGroup["menuGroup"];
  menus: Array<{
    menuKey: MenuKey;
  }>;
};

type ClientMenuProps = Readonly<{
  menus: Array<GenericMenuGroup>;
  className?: string;
}>;

export async function ClientMenu({ menus, className }: ClientMenuProps) {
  const t = await getTranslations("NavigationMenu");

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="gap-1">
        {menus.map((menu) => (
          <NavigationMenuItem key={menu.menuGroup}>
            <NavigationMenuTrigger>
              {t(`groups.${menu.menuGroup}`)}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96 py-1">
                {menu.menus.map(({ menuKey }) => (
                  <SubMenu key={menuKey} menuKey={menuKey} />
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
}>;

async function SubMenu({ menuKey }: SubMenuProps) {
  const t = await getTranslations("NavigationMenu");

  type tKeys = Parameters<typeof t>[0];

  const tKeyDescription = `${menuKey}-description` as tKeys;

  return (
    <ListItem href={getPathByMenuKey(menuKey)} title={t(menuKey as tKeys)}>
      {t.has(tKeyDescription) ? t(tKeyDescription) : null}
    </ListItem>
  );
}
