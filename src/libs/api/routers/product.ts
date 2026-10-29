import { and, eq } from "drizzle-orm";
import {
  createTRPCRouter,
  storePermissionProcedure,
  storePublicProcedure,
} from "~/libs/api/trpc";
import { products, categories } from "~/libs/db/schema";
import {
  createProductSchema,
  updateProductSchema,
} from "~/libs/db/schemas/products";
import { byIdSchema } from "~/libs/db/schemas/common";
import type { inferRouterOutputs } from "@trpc/server";

type ProductOutputs = inferRouterOutputs<typeof productRouter>;

export type Product = ProductOutputs["all"][number];

export type GetProductResponse = Array<Product>;

export const productRouter = createTRPCRouter({
  all: storePublicProcedure.query(async ({ ctx }) => {
    const productsWithCategory = await ctx.db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        keywords: products.keywords,
        categoryName: categories.name,
        active: products.active,
      })
      .from(products)
      .leftJoin(
        categories,
        and(
          eq(products.categoryId, categories.id),
          eq(products.storeId, categories.storeId),
        ),
      )
      .where(eq(products.storeId, ctx.store.id))
      .orderBy(products.createdAt);

    return productsWithCategory ?? null;
  }),

  getById: storePublicProcedure
    .input(byIdSchema)
    .query(async ({ ctx, input }) => {
      const product = await ctx.db
        .select({
          id: products.id,
          categoryId: products.categoryId,
          name: products.name,
          description: products.description,
          price: products.price,
          imageUrl: products.imageUrl,
          keywords: products.keywords,
          categoryName: categories.name,
          active: products.active,
        })
        .from(products)
        .leftJoin(
          categories,
          and(
            eq(products.categoryId, categories.id),
            eq(products.storeId, categories.storeId),
          ),
        )
        .where(
          and(eq(products.id, input.id), eq(products.storeId, ctx.store.id)),
        )
        .orderBy(products.createdAt)
        .then((rows) => rows[0]);

      if (!product) throw new Error("not Found");

      return product ?? null;
    }),

  create: storePermissionProcedure("store.products:manage")
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: (category, { and, eq }) =>
          and(
            eq(category.id, input.categoryId),
            eq(category.storeId, ctx.store.id),
          ),
        columns: { id: true },
      });

      if (!category) throw new Error("Category not found in current store");

      const newProduct = await ctx.db
        .insert(products)
        .values({
          categoryId: input.categoryId,
          storeId: ctx.store.id,
          name: input.name,
          description: input.description,
          price: input.price.toString(),
          imageUrl: input.imageUrl,
          keywords: input.keywords || "",
          createdById: ctx.session.user.id,
        })
        .returning({
          id: products.id,
          name: products.name,
        });

      return newProduct;
    }),

  update: storePermissionProcedure("store.products:edit")
    .input(updateProductSchema)
    .mutation(async ({ ctx, input: { price: priceAsNumber, ...input } }) => {
      const product = await ctx.db.query.products.findFirst({
        where: (product, { and, eq }) =>
          and(eq(product.id, input.id), eq(product.storeId, ctx.store.id)),
      });

      if (!product) throw new Error("not Found");

      const categoryId = input.categoryId;
      if (categoryId !== undefined) {
        const category = await ctx.db.query.categories.findFirst({
          where: (category, { and, eq }) =>
            and(
              eq(category.id, categoryId),
              eq(category.storeId, ctx.store.id),
            ),
          columns: { id: true },
        });

        if (!category) throw new Error("Category not found in current store");
      }

      const price = priceAsNumber?.toString() || product.price;

      const updated = { ...product, ...input, price };

      const newProduct = await ctx.db
        .update(products)
        .set(updated)
        .where(
          and(eq(products.id, input.id), eq(products.storeId, ctx.store.id)),
        )
        .returning({
          id: products.id,
          name: products.name,
        });

      return newProduct;
    }),

  delete: storePermissionProcedure("store.products:manage")
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: (product, { and, eq }) =>
          and(eq(product.id, input.id), eq(product.storeId, ctx.store.id)),
      });

      if (!product) throw new Error("not Found");

      await ctx.db
        .delete(products)
        .where(
          and(eq(products.id, input.id), eq(products.storeId, ctx.store.id)),
        );

      return { imageUrl: product.imageUrl };
    }),
});
