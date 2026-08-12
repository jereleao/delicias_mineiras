import z from "zod";
import { index } from "drizzle-orm/pg-core";
import { byIdSchema, createTable } from "~/libs/db/schemas/common";

export const createBannerSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().url(),
  actionLabel: z.string().min(1),
  actionUrl: z.string().url(),
});

export const updateBannerSchema = byIdSchema.merge(createBannerSchema);

export const banners = createTable(
  "banner",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    title: d.varchar({ length: 256 }),
    description: d.varchar({ length: 256 }),
    imageUrl: d.varchar({ length: 256 }),
    actionLabel: d.varchar({ length: 256 }),
    actionUrl: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("banner_title_idx").on(t.title)],
);
