import type { inferRouterOutputs } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";
import {
  createTRPCRouter,
  optionalStorePublicProcedure,
  storePermissionProcedure,
  storePublicProcedure,
} from "~/libs/api/trpc";
import { configs } from "~/libs/db/schema";
import { CONFIG_CODES } from "~/libs/db/schemas/config";

type ConfigOutputs = inferRouterOutputs<typeof configRouter>;

export type Config = ConfigOutputs["all"][number];

export type GetConfigResponse = Array<Config>;

export const configRouter = createTRPCRouter({
  all: storePublicProcedure.query(async ({ ctx }) => {
    const configs = await ctx.db.query.configs.findMany({
      columns: {
        code: true,
        description: true,
        value: true,
      },
      where: (config, { and, eq, isNotNull }) =>
        and(eq(config.storeId, ctx.store.id), isNotNull(config.value)),
      orderBy: (config, { desc }) => [desc(config.createdAt)],
    });

    return configs ?? null;
  }),

  whatsConfig: storePublicProcedure.query(async ({ ctx }) => {
    const configs = await ctx.db.query.configs.findMany({
      columns: {
        code: true,
        value: true,
      },
      where: (config, { inArray }) =>
        and(
          eq(config.storeId, ctx.store.id),
          inArray(config.code, [
            CONFIG_CODES.whatsNumber,
            CONFIG_CODES.whatsGreeting,
          ]),
        ),
      orderBy: (config, { desc }) => [desc(config.createdAt)],
    });

    const phoneNumber = configs.find(
      (c) => c.code == CONFIG_CODES.whatsNumber,
    )?.value;
    const greeting = configs.find(
      (c) => c.code == CONFIG_CODES.whatsGreeting,
    )?.value;

    if (!phoneNumber || !greeting) return null;

    return { phoneNumber, greeting };
  }),

  storeConfig: optionalStorePublicProcedure.query(async ({ ctx }) => {
    if (!ctx.store) return null;

    const storeId = ctx.store.id;

    const storeBranding = await ctx.db.query.storeBranding.findFirst({
      where: (branding, { eq }) => eq(branding.storeId, storeId),
    });

    if (!storeBranding) return null;

    return {
      storeSlug: ctx.store.slug,
      metaTitle: ctx.store.name,
      ...storeBranding,
    };
  }),

  update: storePermissionProcedure("admin.configs:edit")
    .input(
      z.object({
        code: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.db.query.configs.findFirst({
        where: (config, { and, eq }) =>
          and(eq(config.code, input.code), eq(config.storeId, ctx.store.id)),
      });

      if (!config) throw new Error("not Found");

      const newConfig = await ctx.db
        .update(configs)
        .set({ value: input.value })
        .where(
          and(eq(configs.code, input.code), eq(configs.storeId, ctx.store.id)),
        )
        .returning({
          code: configs.code,
          description: configs.description,
          value: configs.value,
        });

      return newConfig;
    }),
});
