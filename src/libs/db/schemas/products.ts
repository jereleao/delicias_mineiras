import { foreignKey, index } from "drizzle-orm/pg-core";
import z from "zod";
import { categories, users } from "~/libs/db/schema";
import { byIdSchema, createTable } from "~/libs/db/schemas/common";
import { stores } from "~/libs/db/schemas/stores";

export const createProductSchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1),
  description: z.string().nullable(),
  price: z.number(),
  imageUrl: z.string(),
  keywords: z.string().nullable(),
});

export type CreateProductType = z.infer<typeof createProductSchema>;

const updatePropertiesSchema = createProductSchema
  .merge(
    z.object({
      active: z.boolean(),
    }),
  )
  .partial();

export const updateProductSchema = byIdSchema.merge(updatePropertiesSchema);

export type UpdateProductType = z.infer<typeof updateProductSchema>;

export const products = createTable(
  "product",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    categoryId: d.integer().notNull(),
    storeId: d
      .integer()
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 256 }).notNull(),
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
    foreignKey({
      columns: [t.categoryId, t.storeId],
      foreignColumns: [categories.id, categories.storeId],
      name: "product_category_store_fk",
    }),
    index("product_store_category_idx").on(t.storeId, t.categoryId),
    index("product_created_by_idx").on(t.createdById),
    index("product_store_name_idx").on(t.storeId, t.name),
  ],
);
