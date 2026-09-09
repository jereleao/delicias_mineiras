import type { inferRouterOutputs } from "@trpc/server";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  permissionProcedure,
  publicProcedure,
} from "~/libs/api/trpc";
import { banners } from "~/libs/db/schema";
import {
  createBannerSchema,
  updateBannerSchema,
} from "~/libs/db/schemas/banners";
import { byIdSchema } from "~/libs/db/schemas/common";

type BannerOutputs = inferRouterOutputs<typeof bannerRouter>;

export type Banner = BannerOutputs["all"][number];

export type GetBannerResponse = Array<Banner>;

export const bannerRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const banners = await ctx.db.query.banners.findMany({
      columns: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        actionLabel: true,
        actionUrl: true,
        active: true,
      },
      where: (banner, { isNotNull }) => isNotNull(banner.imageUrl),
      orderBy: (banner, { desc }) => [desc(banner.createdAt)],
    });

    return banners ?? null;
  }),

  active: publicProcedure.query(async ({ ctx }) => {
    const banners = await ctx.db.query.banners.findMany({
      columns: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        actionLabel: true,
        actionUrl: true,
        active: true,
      },
      where: (banner, { isNotNull, and }) =>
        and(isNotNull(banner.imageUrl), banner.active),
      orderBy: (banner, { desc }) => [desc(banner.createdAt)],
    });

    return banners ?? null;
  }),

  getById: permissionProcedure("admin.banners")
    .input(byIdSchema)
    .query(async ({ ctx, input }) => {
      const banner = await ctx.db.query.banners.findFirst({
        where: (banner, { eq }) => eq(banner.id, input.id),
        orderBy: (banner, { desc }) => [desc(banner.createdAt)],
      });
      if (!banner) throw new Error("not Found");

      return banner ?? null;
    }),

  create: permissionProcedure("admin.banners:manage")
    .input(createBannerSchema)
    .mutation(async ({ ctx, input }) => {
      const bannerData = {
        title: input.title,
        description: input.description,
        imageUrl: input.imageUrl,
        actionLabel: input.actionLabel,
        actionUrl: input.actionUrl,
        createdById: ctx.session.user.id,
      };

      const newBanner = await ctx.db
        .insert(banners)
        .values(bannerData)
        .returning({
          id: banners.id,
          title: banners.title,
          description: banners.description,
          imageUrl: banners.imageUrl,
          actionLabel: banners.actionLabel,
          actionUrl: banners.actionUrl,
          active: banners.active,
        });

      return newBanner;
    }),

  update: permissionProcedure("admin.banners:edit")
    .input(updateBannerSchema)
    .mutation(async ({ ctx, input }) => {
      const banner = await ctx.db.query.banners.findFirst({
        where: (banner, { eq }) => eq(banner.id, input.id),
      });

      if (!banner) throw new Error("not Found");

      const updated = { ...banner, ...input };

      const newBanner = await ctx.db
        .update(banners)
        .set(updated)
        .where(eq(banners.id, input.id))
        .returning({
          id: banners.id,
          title: banners.title,
          description: banners.description,
          imageUrl: banners.imageUrl,
          actionLabel: banners.actionLabel,
          actionUrl: banners.actionUrl,
          active: banners.active,
        });

      return newBanner;
    }),

  delete: permissionProcedure("admin.banners:manage")
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const banner = await ctx.db.query.banners.findFirst({
        where: (banner, { eq }) => eq(banner.id, input.id),
      });

      if (!banner) throw new Error("not Found");

      await ctx.db.delete(banners).where(eq(banners.id, input.id));

      return { imageUrl: banner.imageUrl };
    }),
});
