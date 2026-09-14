export const MENUS = [
  {
    menuGroup: "navbar.home",
    menus: [
      {
        menuKey: "admin.banners",
      },
    ],
  },
  {
    menuGroup: "navbar.products",
    menus: [
      {
        menuKey: "admin.products",
      },
      {
        menuKey: "admin.categories",
      },
    ],
  },
  {
    menuGroup: "navbar.administration",
    menus: [
      {
        menuKey: "admin.users",
      },
      {
        menuKey: "admin.configs",
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
  const subMenus = MENUS.flatMap((menuGroup) =>
    menuGroup.menus.map((menu) => menu),
  );

  const menu = subMenus.find((menu) => menu.menuKey === getMenuKeyByPath(href));

  if (menu) return menu.menuKey;

  return undefined;
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
  return `/${menuKey.replace(".", "/")}`;
}

export function getMenuKeyByPath(path: string): MenuKey | undefined {
  const menuKey = path.split("/").filter(Boolean).join(".") as MenuKey;

  return MENU_KEYS.includes(menuKey) ? menuKey : undefined;
}
