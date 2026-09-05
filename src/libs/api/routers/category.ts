import { eq } from "drizzle-orm";
import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter, permissionProcedure } from "~/libs/api/trpc";
import { categories } from "~/libs/db/schema";
import {
  createCategorySchema,
  updateCategorySchema,
} from "~/libs/db/schemas/categories";
import { byIdSchema } from "~/libs/db/schemas/common";

type CategoryOutputs = inferRouterOutputs<typeof categoryRouter>;

export type Category = CategoryOutputs["all"][number];

export type GetCategoryResponse = Array<Category>;

export const categoryRouter = createTRPCRouter({
  all: permissionProcedure("admin.categories").query(async ({ ctx }) => {
    const categories = await ctx.db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
      },
    });

    return categories ?? null;
  }),

  getById: permissionProcedure("admin.categories")
    .input(byIdSchema)
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.id, input.id),
        orderBy: (category, { desc }) => [desc(category.createdAt)],
      });
      if (!category) throw new Error("not Found");

      return category ?? null;
    }),

  create: permissionProcedure("admin.categories:manage")
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

  update: permissionProcedure("admin.categories:edit")
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.id, input.id),
      });

      if (!category) throw new Error("not Found");

      const newCategory = await ctx.db
        .update(categories)
        .set({
          name: input.name,
        })
        .where(eq(categories.id, input.id))
        .returning({
          id: categories.id,
          name: categories.name,
        });

      return newCategory;
    }),

  delete: permissionProcedure("admin.categories:manage")
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.id, input.id),
      });

      if (!category) throw new Error("not Found");

      await ctx.db.delete(categories).where(eq(categories.id, input.id));
    }),
});
