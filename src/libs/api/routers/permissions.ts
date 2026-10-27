import type { inferRouterOutputs } from "@trpc/server";
import {
  createTRPCRouter,
  permissionProcedure,
  storePermissionProcedure,
} from "~/libs/api/trpc";

type PermissionsOutputs = inferRouterOutputs<typeof permissionRouter>;

export type Role = PermissionsOutputs["platformRoles"][number];

export const permissionRouter = createTRPCRouter({
  platformRoles: permissionProcedure("users").query(async ({ ctx }) => {
    return ctx.db.query.roles.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
      },
      where: (role, { isNull }) => isNull(role.storeId),
    });
  }),

  storeRoles: storePermissionProcedure("store.users").query(
    async ({ ctx }) => {
      return ctx.db.query.roles.findMany({
        columns: {
          id: true,
          name: true,
          description: true,
        },
        where: (role, { eq }) => eq(role.storeId, ctx.store.id),
      });
    },
  ),

});
