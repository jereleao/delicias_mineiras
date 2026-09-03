export const ADMIN_MENUS = [
  {
    tKeyTitle: "navbar.products",
    menus: [
      {
        tKeyTitle: "admin.products",
        tKeyDescription: "admin.products-description",
        href: "/admin/products",
      },
      {
        tKeyTitle: "admin.categories",
        href: "/admin/categories",
      },
    ],
  },
  {
    tKeyTitle: "navbar.administration",
    menus: [
      {
        tKeyTitle: "admin.users",
        href: "/admin/users",
      },
    ],
  },
] as const;
