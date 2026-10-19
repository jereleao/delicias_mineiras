import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";

export const stores = createTable(
  "store",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    slug: d.varchar({ length: 128 }).notNull(),
    active: d.boolean().default(true).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    uniqueIndex("store_slug_idx").on(t.slug),
    index("store_active_idx").on(t.active),
  ],
);
