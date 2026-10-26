import z from "zod";
import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { byIdSchema, createTable } from "~/libs/db/schemas/common";

const imageUrlOrPathSchema = z
  .string()
  .max(2048)
  .refine(
    (value) =>
      value === "" ||
      z.url({ protocol: /^https?$/ }).safeParse(value).success ||
      (value.startsWith("/") && !value.startsWith("//")),
    "Enter a valid URL or root-relative path.",
  );

const domainSchema = z
  .string()
  .min(1)
  .max(253)
  .refine((domain) => {
    try {
      const parsedDomain = new URL(`https://${domain}`);
      return (
        parsedDomain.hostname.toLowerCase() === domain.toLowerCase() &&
        parsedDomain.pathname === "/" &&
        !parsedDomain.search &&
        !parsedDomain.hash
      );
    } catch {
      return false;
    }
  }, "Enter a valid hostname.");

export const storeBrandingSchema = z
  .object({
    baseColor: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Enter a valid hex color."),
    metaDescription: z.string(),
    faviconUrl: imageUrlOrPathSchema,
    logoFullLight: imageUrlOrPathSchema,
    logoFullDark: imageUrlOrPathSchema,
    logoSmallLight: imageUrlOrPathSchema,
    logoSmallDark: imageUrlOrPathSchema,
  })
  .refine(
    ({ logoFullLight, logoFullDark, logoSmallLight, logoSmallDark }) =>
      Boolean(logoFullLight || logoFullDark || logoSmallLight || logoSmallDark),
    {
      path: [],
      message: "At least one logo is required.",
    },
  );

export const createStoreSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(3)
    .max(63)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens only.",
    ),
  domains: z.array(
    z.object({
      domain: domainSchema,
    }),
  ),
  active: z.boolean(),
  branding: storeBrandingSchema,
});

export type CreateStoreType = z.infer<typeof createStoreSchema>;

const updatePropertiesSchema = createStoreSchema
  .merge(
    z.object({
      active: z.boolean(),
    }),
  )
  .partial();

export const updateStoreSchema = byIdSchema.merge(updatePropertiesSchema);

export type UpdateStoreType = z.infer<typeof updateStoreSchema>;

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
