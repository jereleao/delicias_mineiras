import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import z from "zod";
import { byIdSchema, createTable } from "~/libs/db/schemas/common";
import { stores } from "~/libs/db/schemas/stores";

export const createRoleSchema = z.object({
  name: z.string().trim().min(1).max(100),
  storeId: z.coerce.number().nullable(),
  description: z.string().trim().max(255).nullable(),
  permissions: z
    .array(
      z
        .string()
        .regex(/^[1-9]\d*$/)
        .refine((id) => Number.isSafeInteger(Number(id))),
    )
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Permission IDs must be unique.",
    }),
});

export const updateRoleSchema = byIdSchema.merge(createRoleSchema);

export type RoleInput = z.infer<typeof createRoleSchema>;

export const roles = createTable(
  "role",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    storeId: d.integer().references(() => stores.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 255 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    uniqueIndex("role_platform_name_idx")
      .on(t.name)
      .where(sql`${t.storeId} is null`),
    uniqueIndex("role_store_name_idx")
      .on(t.storeId, t.name)
      .where(sql`${t.storeId} is not null`),
    index("role_store_idx").on(t.storeId),
  ],
);

export const permissions = createTable(
  "permission",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    key: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 255 }),
  }),
  (t) => [uniqueIndex("permission_key_idx").on(t.key)],
);

export const rolePermissions = createTable(
  "role_permission",
  (d) => ({
    roleId: d
      .integer()
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: d
      .integer()
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  }),
  (t) => [
    primaryKey({ columns: [t.roleId, t.permissionId] }),
    index("role_permission_permission_idx").on(t.permissionId),
  ],
);

export const roleRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const permissionRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);
