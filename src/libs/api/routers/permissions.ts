import { TRPCError, type inferRouterOutputs } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import {
  createTRPCRouter,
  permissionProcedure,
  protectedProcedure,
  storePermissionProcedure,
} from "~/libs/api/trpc";
import { permissions, rolePermissions, roles, stores } from "~/libs/db/schema";
import {
  createRoleSchema,
  updateRoleSchema,
} from "~/libs/db/schemas/permissions";
import { byIdSchema } from "~/libs/db/schemas/common";

type PermissionsOutputs = inferRouterOutputs<typeof permissionRouter>;

export type FullRole = PermissionsOutputs["allRoles"][number];
export type RoleOption = PermissionsOutputs["roleOptions"][number];

export const permissionRouter = createTRPCRouter({
  all: permissionProcedure("permissions").query(async ({ ctx }) => {
    return ctx.db.query.permissions.findMany({
      columns: {
        id: true,
        key: true,
        description: true,
      },
      orderBy: (p) => p.key,
    });
  }),

  roleOptions: protectedProcedure.query(async ({ ctx }) => {
    const roleOptions = await ctx.db
      .select({
        id: roles.id,
        name: roles.name,
        storeSlug: stores.slug,
        description: roles.description,
      })
      .from(roles)
      .leftJoin(stores, eq(roles.storeId, stores.id))
      .orderBy(stores.slug, roles.name);

    return (
      roleOptions?.map((o) => ({
        id: o.id,
        key: `${o.storeSlug ? `${o.storeSlug}:${o.name}` : o.name}`,
        description: o.description,
      })) ?? []
    );
  }),

  allRoles: permissionProcedure("permissions").query(async ({ ctx }) => {
    const allRoles = await ctx.db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        storeId: roles.storeId,
        storeName: stores.name,
        storeSlug: stores.slug,
        permissions: sql<string[]>`
              coalesce(
                array_agg(CAST(${rolePermissions.permissionId} AS text)),
                array[]::varchar[]
              )
            `,
      })
      .from(roles)
      .leftJoin(stores, eq(roles.storeId, stores.id))
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .groupBy(
        roles.id,
        roles.name,
        roles.description,
        roles.storeId,
        stores.name,
        stores.slug,
      )
      .orderBy(roles.createdAt);

    return allRoles ?? null;
  }),

  createRole: permissionProcedure("permissions:manage")
    .input(createRoleSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const permissionIds = input.permissions.map(Number);
        const existingPermissions = permissionIds.length
          ? await tx
              .select({ id: permissions.id })
              .from(permissions)
              .where(inArray(permissions.id, permissionIds))
          : [];

        if (existingPermissions.length !== permissionIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more permissions do not exist.",
          });
        }

        const [role] = await tx
          .insert(roles)
          .values({
            name: input.name,
            description: input.description || null,
          })
          .returning({
            id: roles.id,
            name: roles.name,
            description: roles.description,
          });

        if (!role) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create platform role.",
          });
        }

        if (permissionIds.length > 0) {
          await tx.insert(rolePermissions).values(
            permissionIds.map((permissionId) => ({
              roleId: role.id,
              permissionId,
            })),
          );
        }

        return { ...role, permissions: input.permissions };
      });
    }),

  updateRole: permissionProcedure("permissions:edit")
    .input(updateRoleSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const permissionIds = input.permissions.map(Number);
        const existingPermissions = permissionIds.length
          ? await tx
              .select({ id: permissions.id })
              .from(permissions)
              .where(inArray(permissions.id, permissionIds))
          : [];

        if (existingPermissions.length !== permissionIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more permissions do not exist.",
          });
        }

        const [role] = await tx
          .update(roles)
          .set({
            name: input.name,
            description: input.description || null,
          })
          .where(eq(roles.id, input.id))
          .returning({
            id: roles.id,
            name: roles.name,
            description: roles.description,
          });

        if (!role) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Platform role not found.",
          });
        }

        await tx
          .delete(rolePermissions)
          .where(eq(rolePermissions.roleId, role.id));

        if (permissionIds.length > 0) {
          await tx.insert(rolePermissions).values(
            permissionIds.map((permissionId) => ({
              roleId: role.id,
              permissionId,
            })),
          );
        }

        return { ...role, permissions: input.permissions };
      });
    }),

  deleteRole: permissionProcedure("permissions:manage")
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedRole] = await ctx.db
        .delete(roles)
        .where(eq(roles.id, input.id))
        .returning({ id: roles.id });

      if (!deletedRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Platform role not found.",
        });
      }
    }),

  storeRoles: storePermissionProcedure("store.users").query(async ({ ctx }) => {
    return ctx.db.query.roles.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
      },
      where: (role, { eq }) => eq(role.storeId, ctx.store.id),
    });
  }),
});
