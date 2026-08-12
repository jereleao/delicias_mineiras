import z from "zod";
import { index } from "drizzle-orm/pg-core";
import { users } from "~/libs/db/schema";
import { byIdSchema, createTable } from "~/libs/db/schemas/common";

export const createCategorySchema = z.object({
  name: z.string().min(1),
});

export const updateCategorySchema = byIdSchema.merge(createCategorySchema);

export const categories = createTable(
  "category",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
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
    index("category_created_by_idx").on(t.createdById),
    index("category_name_idx").on(t.name),
  ],
);
