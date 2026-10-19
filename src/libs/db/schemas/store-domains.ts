import { sql } from "drizzle-orm";
import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";
import { stores } from "~/libs/db/schemas/stores";

export const storeDomains = createTable(
  "store_domain",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    storeId: d
      .integer()
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    domain: d.varchar({ length: 253 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (t) => [
    uniqueIndex("store_domain_domain_idx").on(sql`lower(${t.domain})`),
    index("store_domain_store_idx").on(t.storeId),
  ],
);
