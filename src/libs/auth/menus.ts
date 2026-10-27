export const MENUS = [
  {
    menuGroup: "store.home",
    menus: [
      {
        menuKey: "store.banners",
      },
    ],
  },
  {
    menuGroup: "store.products",
    menus: [
      {
        menuKey: "store.products",
      },
      {
        menuKey: "store.categories",
      },
    ],
  },
  {
    menuGroup: "store.administration",
    menus: [
      {
        menuKey: "store.users",
      },
      {
        menuKey: "store.configs",
      },
    ],
  },
  {
    menuGroup: "root",
    menus: [
      {
        menuKey: "stores",
      },
      {
        menuKey: "users",
      },
    ],
  },
] as const;

export const MENU_KEYS = MENUS.flatMap((menuGroup) =>
  menuGroup.menus.map((menu) => menu.menuKey),
);

export type MenuGroup = (typeof MENUS)[number];

export type Menu = MenuGroup["menus"][number];

export type MenuKey = Menu["menuKey"];

type PrefixOfMenuKey<T extends string> = T extends `${infer Prefix}.${string}`
  ? Prefix
  : never;

export type MenuKeyPrefix = PrefixOfMenuKey<MenuKey>;

export function getMenuKeyByHref(href: string): MenuKey | undefined {
  const path = href.split(/[?#]/, 1)[0]?.replace(/\/+$/, "") || "/";

  const sortedMenuKeys = [...MENU_KEYS].sort((a, b) => b.length - a.length);

  const foundMenuKey = sortedMenuKeys.find((menuKey) => {
    const menuPath = getPathByMenuKey(menuKey);
    return path === menuPath || path.startsWith(`${menuPath}/`);
  });

  return foundMenuKey;
}

const permissionsAddons = ["edit", "manage"] as const;

type PermissionAddon = (typeof permissionsAddons)[number];

export type PermissionKey =
  MenuKeyPrefix | MenuKey | `${MenuKey}:${PermissionAddon}`;

export const permissionKeys = MENU_KEYS.flatMap((menuKey) => [
  menuKey,
  ...permissionsAddons.map(
    (permissionAddon) => `${menuKey}:${permissionAddon}` as PermissionKey,
  ),
]);

export function isAllowed(
  permission: PermissionKey,
  permissions: Array<PermissionKey>,
) {
  if (permissions.includes(permission)) return true;

  return (
    !permission.includes(":") &&
    permissions.some(
      (grantedPermission) =>
        grantedPermission.startsWith(`${permission}.`) ||
        grantedPermission.startsWith(`${permission}:`),
    )
  );
}

export function getPathByMenuKey(menuKey: MenuKey): string {
  const routeKey = menuKey.startsWith("store.")
    ? `admin.${menuKey.slice("store.".length)}`
    : menuKey;
  return `/${routeKey.replaceAll(".", "/")}`;
}

export function getMenuKeyByPath(path: string): MenuKey | undefined {
  const rawMenuKey = path.split("/").filter(Boolean).join(".");
  const menuKey = (
    rawMenuKey.startsWith("admin.")
      ? `store.${rawMenuKey.slice("admin.".length)}`
      : rawMenuKey
  ) as MenuKey;

  return MENU_KEYS.includes(menuKey) ? menuKey : undefined;
}
