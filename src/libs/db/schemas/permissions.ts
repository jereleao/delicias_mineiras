import { relations } from "drizzle-orm";
import { index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";

export const roles = createTable(
  "role",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.varchar({ length: 255 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [uniqueIndex("role_name_idx").on(t.name)],
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
