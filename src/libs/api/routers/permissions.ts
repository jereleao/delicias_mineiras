import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/libs/api/trpc";

type PermissionsOutputs = inferRouterOutputs<typeof permissionRouter>;

export type Role = PermissionsOutputs["roles"][number];

export const permissionRouter = createTRPCRouter({
  roles: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.query.roles.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
      },
    });

    return categories ?? null;
  }),
});
