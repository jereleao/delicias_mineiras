import { primaryKey } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";
import { stores } from "~/libs/db/schemas/stores";

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
