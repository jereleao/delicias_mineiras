import { auth } from "~/libs/auth";
import { isAllowed, MENUS } from "~/libs/auth/menus";
import { getStoreForCurrentHost } from "~/libs/stores/server";
import { ClientMenu } from "./client-menu";

type NavigationMenuProps = Readonly<{
  className?: string;
}>;

export async function NavigationMenu({ className }: NavigationMenuProps) {
  const store = await getStoreForCurrentHost();

  const session = await auth();

  const plataformPermissions = session?.user.permissions.platform ?? [];
  const storePermissions = store
    ? (session?.user.permissions.stores[store.id] ?? [])
    : [];

  const allowedMenus = MENUS.filter((menu) =>
    store
      ? menu.menuGroup.startsWith("store")
      : !menu.menuGroup.startsWith("store"),
  )
    .map(({ menuGroup, menus }) => ({
      menuGroup,
      menus: menus.filter(({ menuKey }) =>
        isAllowed(menuKey, [...plataformPermissions, ...storePermissions]),
      ),
    }))
    .filter(({ menus }) => menus.length > 0);

  return <ClientMenu className={className} menus={allowedMenus} />;
}
