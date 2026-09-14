import { index } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";

export const configs = createTable(
  "config",
  (d) => ({
    code: d.varchar({ length: 256 }).primaryKey(),
    description: d.varchar({ length: 256 }),
    value: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("config_code_idx").on(t.code)],
);
