export const MENUS = [
  {
    menuGroup: "navbar.home",
    menus: [
      {
        menuKey: "admin.banners",
        href: "/admin/banners",
      },
    ],
  },
  {
    menuGroup: "navbar.products",
    menus: [
      {
        menuKey: "admin.products",
        href: "/admin/products",
      },
      {
        menuKey: "admin.categories",
        href: "/admin/categories",
      },
    ],
  },
  {
    menuGroup: "navbar.administration",
    menus: [
      {
        menuKey: "admin.users",
        href: "/admin/users",
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

export function getMenuKeyByHref(href: string): MenuKey | undefined {
  const subMenus = MENUS.flatMap((menuGroup) =>
    menuGroup.menus.map((menu) => menu),
  );

  const menu = subMenus.find((menu) => menu.href === href);

  if (menu) return menu.menuKey;

  return undefined;
}

const permissionsAddons = ["edit", "manage"] as const;

type PermissionAddon = (typeof permissionsAddons)[number];

export type PermissionKey = MenuKey | `${MenuKey}:${PermissionAddon}`;

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
    permissions.some((grantedPermission) =>
      grantedPermission.startsWith(`${permission}:`),
    )
  );
}
