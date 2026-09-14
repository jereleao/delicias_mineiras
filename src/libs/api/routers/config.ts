import type { inferRouterOutputs } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import {
  createTRPCRouter,
  permissionProcedure,
  publicProcedure,
} from "~/libs/api/trpc";
import { configs } from "~/libs/db/schema";

type ConfigOutputs = inferRouterOutputs<typeof configRouter>;

export type Config = ConfigOutputs["all"][number];

export type GetConfigResponse = Array<Config>;

export const configRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const configs = await ctx.db.query.configs.findMany({
      columns: {
        code: true,
        description: true,
        value: true,
      },
      where: (config, { isNotNull }) => isNotNull(config.value),
      orderBy: (config, { desc }) => [desc(config.createdAt)],
    });

    return configs ?? null;
  }),

  update: permissionProcedure("admin.banners:edit")
    .input(
      z.object({
        code: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.db.query.configs.findFirst({
        where: (config, { eq }) => eq(config.code, input.code),
      });

      if (!config) throw new Error("not Found");

      const updated = { ...config, ...input };

      const newConfig = await ctx.db
        .update(configs)
        .set(updated)
        .where(eq(configs.code, input.code))
        .returning({
          code: configs.code,
          description: configs.description,
          value: configs.value,
        });

      return newConfig;
    }),
});
