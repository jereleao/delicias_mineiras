import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/libs/api/trpc";
import { banners } from "~/libs/db/schema";
import {
  createBannerSchema,
  updateBannerSchema,
} from "~/libs/db/schemas/banners";
import { byIdSchema } from "~/libs/db/schemas/common";

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
      },
      where: (banner, { isNotNull }) => isNotNull(banner.imageUrl),
      orderBy: (banner, { desc }) => [desc(banner.createdAt)],
    });

    return banners ?? null;
  }),

  getById: publicProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const banner = await ctx.db.query.banners.findFirst({
      where: (banner, { eq }) => eq(banner.id, input.id),
      orderBy: (banner, { desc }) => [desc(banner.createdAt)],
    });
    if (!banner) throw new Error("not Found");

    return banner ?? null;
  }),

  create: protectedProcedure
    .input(createBannerSchema)
    .mutation(async ({ ctx, input }) => {
      const newBanner = {
        title: input.title,
        description: input.description,
        imageUrl: input.imageUrl,
        actionLabel: input.actionLabel,
        actionUrl: input.actionUrl,
        createdById: ctx.session.user.id,
      };

      await ctx.db.insert(banners).values(newBanner);
    }),

  update: protectedProcedure
    .input(updateBannerSchema)
    .mutation(async ({ ctx, input }) => {
      const banner = await ctx.db.query.banners.findFirst({
        where: (banner, { eq }) => eq(banner.id, input.id),
      });

      if (!banner) throw new Error("not Found");

      await ctx.db
        .update(banners)
        .set({
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          actionLabel: input.actionLabel,
          actionUrl: input.actionUrl,
        })
        .where(eq(banners.id, input.id));
    }),

  delete: protectedProcedure
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const banner = await ctx.db.query.banners.findFirst({
        where: (banner, { eq }) => eq(banner.id, input.id),
      });

      if (!banner) throw new Error("not Found");

      await ctx.db.delete(banners).where(eq(banners.id, input.id));
    }),
});
