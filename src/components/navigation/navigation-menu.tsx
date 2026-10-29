import { isAllowed, MENUS } from "~/libs/auth/menus";
import {
  getStoreScopedPermissions,
  hasStoreForCurrentHost,
} from "~/libs/stores/server";
import { ClientMenu } from "./client-menu";

type NavigationMenuProps = Readonly<{
  className?: string;
}>;

export async function NavigationMenu({ className }: NavigationMenuProps) {
  const hasStore = await hasStoreForCurrentHost();

  const permissions = await getStoreScopedPermissions();

  const allowedMenus = MENUS.filter((menu) =>
    hasStore
      ? menu.menuGroup.startsWith("store")
      : !menu.menuGroup.startsWith("store"),
  )
    .map(({ menuGroup, menus }) => ({
      menuGroup,
      menus: menus.filter(({ menuKey }) => isAllowed(menuKey, permissions)),
    }))
    .filter(({ menus }) => menus.length > 0);

  return <ClientMenu className={className} menus={allowedMenus} />;
}
