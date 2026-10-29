import { and, eq } from "drizzle-orm";
import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter, storePermissionProcedure } from "~/libs/api/trpc";
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
  all: storePermissionProcedure("store.categories").query(async ({ ctx }) => {
    const categories = await ctx.db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: (category, { eq }) => eq(category.storeId, ctx.store.id),
    });

    return categories ?? null;
  }),

  getById: storePermissionProcedure("store.categories")
    .input(byIdSchema)
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { and, eq }) =>
          and(eq(category.id, input.id), eq(category.storeId, ctx.store.id)),
        orderBy: (category, { desc }) => [desc(category.createdAt)],
      });
      if (!category) throw new Error("not Found");

      return category ?? null;
    }),

  create: storePermissionProcedure("store.categories:manage")
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const newCategory = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          storeId: ctx.store.id,
          createdById: ctx.session.user.id,
        })
        .returning({
          id: categories.id,
          name: categories.name,
        });

      return newCategory;
    }),

  update: storePermissionProcedure("store.categories:edit")
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { and, eq }) =>
          and(eq(category.id, input.id), eq(category.storeId, ctx.store.id)),
      });

      if (!category) throw new Error("not Found");

      const newCategory = await ctx.db
        .update(categories)
        .set({
          name: input.name,
        })
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.storeId, ctx.store.id),
          ),
        )
        .returning({
          id: categories.id,
          name: categories.name,
        });

      return newCategory;
    }),

  delete: storePermissionProcedure("store.categories:manage")
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { and, eq }) =>
          and(eq(category.id, input.id), eq(category.storeId, ctx.store.id)),
      });

      if (!category) throw new Error("not Found");

      await ctx.db
        .delete(categories)
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.storeId, ctx.store.id),
          ),
        );
    }),
});
