import z from "zod";
import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "~/libs/db/schema";
import { byIdSchema, createTable } from "~/libs/db/schemas/common";
import { stores } from "~/libs/db/schemas/stores";

export const createCategorySchema = z.object({
  name: z.string().min(1),
});

export const updateCategorySchema = byIdSchema.merge(createCategorySchema);

export const categories = createTable(
  "category",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    storeId: d
      .integer()
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    uniqueIndex("category_id_store_idx").on(t.id, t.storeId),
    index("category_store_idx").on(t.storeId),
    index("category_created_by_idx").on(t.createdById),
    index("category_store_name_idx").on(t.storeId, t.name),
  ],
);
