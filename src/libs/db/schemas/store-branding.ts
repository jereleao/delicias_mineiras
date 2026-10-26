import { sql } from "drizzle-orm";
import { check } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";
import { stores } from "~/libs/db/schemas/stores";

export const storeBranding = createTable(
  "store_branding",
  (d) => ({
    storeId: d
      .integer()
      .primaryKey()
      .references(() => stores.id, { onDelete: "cascade" }),
    baseColor: d.varchar({ length: 7 }).notNull().default("#000000"),
    metaDescription: d.text(),
    faviconUrl: d.text(),
    logoFullLight: d.text(),
    logoFullDark: d.text(),
    logoSmallLight: d.text(),
    logoSmallDark: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    check(
      "store_branding_base_color_check",
      sql`${t.baseColor} ~ '^#[0-9A-Fa-f]{6}$'`,
    ),
    check(
      "store_branding_has_logo_check",
      sql`${t.logoFullLight} IS NOT NULL
        OR ${t.logoFullDark} IS NOT NULL
        OR ${t.logoSmallLight} IS NOT NULL
        OR ${t.logoSmallDark} IS NOT NULL`,
    ),
  ],
);
