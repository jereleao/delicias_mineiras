import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/libs/api/trpc";
import { categories } from "~/libs/db/schema";
import {
  createCategorySchema,
  updateCategorySchema,
} from "~/libs/db/schemas/categories";
import { byIdSchema } from "~/libs/db/schemas/common";

export const categoryRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
      },
    });

    return categories ?? null;
  }),

  getById: publicProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const category = await ctx.db.query.categories.findFirst({
      where: (category, { eq }) => eq(category.id, input.id),
      orderBy: (category, { desc }) => [desc(category.createdAt)],
    });
    if (!category) throw new Error("not Found");

    return category ?? null;
  }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const newCategory = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          createdById: ctx.session.user.id,
        })
        .returning({
          id: categories.id,
          name: categories.name,
        });

      return newCategory;
    }),

  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.id, input.id),
      });

      if (!category) throw new Error("not Found");

      await ctx.db
        .update(categories)
        .set({
          name: input.name,
        })
        .where(eq(categories.id, input.id));
    }),

  delete: protectedProcedure
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.id, input.id),
      });

      if (!category) throw new Error("not Found");

      await ctx.db.delete(categories).where(eq(categories.id, input.id));
    }),
});
