import { isAllowed, MENUS } from "~/libs/auth/menus";
import {
  getStoreScopedPermissions,
  hasStoreForCurrentHost,
} from "~/libs/stores/server";
import { ClientDrawer } from "./client-drawer";

type DrawerMenuProps = Readonly<{
  className?: string;
}>;

export async function DrawerMenu({ className }: DrawerMenuProps) {
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

  return <ClientDrawer className={className} menus={allowedMenus} />;
}
