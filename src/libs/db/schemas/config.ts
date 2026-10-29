import { primaryKey } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";
import { stores } from "~/libs/db/schemas/stores";

export const CONFIG_CODES = {
  whatsNumber: "WHATS_NUMBER",
  whatsGreeting: "WHATS_GREETING",
  logoFullDark: "LOGO_FULL_DARK",
  logoFullLight: "LOGO_FULL_LIGHT",
  logoSmallDark: "LOGO_SMALL_DARK",
  logoSmallLight: "LOGO_SMALL_LIGHT",
  metaDataTitle: "META_DATA_TITLE",
  metaDataDescription: "META_DATA_DESCRIPTION",
  metaDataFaviconUrl: "METAR_DATA_FAVICON_URL",
};

export const configs = createTable(
  "config",
  (d) => ({
    storeId: d
      .integer()
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    code: d.varchar({ length: 256 }).notNull(),
    description: d.varchar({ length: 256 }),
    value: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [primaryKey({ columns: [t.storeId, t.code] })],
);
