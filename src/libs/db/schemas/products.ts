import { index } from "drizzle-orm/pg-core";
import z from "zod";
import { categories, users } from "~/libs/db/schema";
import { byIdSchema, createTable } from "~/libs/db/schemas/common";

export const createProductSchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number(),
  imageUrl: z.string(),
  keywords: z.string().optional(),
});

export type CreateProductType = z.infer<typeof createProductSchema>;

export const updateProductSchema = byIdSchema.merge(createProductSchema);

export const products = createTable(
  "product",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    categoryId: d
      .integer()
      .notNull()
      .references(() => categories.id),
    name: d.varchar({ length: 256 }),
    description: d.varchar({ length: 256 }),
    price: d.numeric({ precision: 10, scale: 2 }).notNull(),
    imageUrl: d.varchar({ length: 256 }),
    keywords: d.varchar({ length: 256 }),
    active: d.boolean().default(true),
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
    index("product_created_by_idx").on(t.createdById),
    index("product_name_idx").on(t.name),
  ],
);
