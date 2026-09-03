export const ADMIN_MENUS = [
  {
    menuKey: "navbar.products",
    menus: [
      {
        menuKey: "admin.products",
        tKeyDescription: "admin.products-description",
        href: "/admin/products",
      },
      {
        menuKey: "admin.categories",
        href: "/admin/categories",
      },
    ],
  },
  {
    menuKey: "navbar.administration",
    menus: [
      {
        menuKey: "admin.users",
        href: "/admin/users",
      },
    ],
  },
] as const;
