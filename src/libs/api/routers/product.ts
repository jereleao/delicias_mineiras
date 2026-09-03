import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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
  all: publicProcedure.query(async ({ ctx }) => {
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
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(products.createdAt);

    return productsWithCategory ?? null;
  }),

  getById: publicProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
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
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, input.id))
      .orderBy(products.createdAt)
      .then((rows) => rows[0]);

    if (!product) throw new Error("not Found");

    return product ?? null;
  }),

  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const newProduct = await ctx.db
        .insert(products)
        .values({
          categoryId: input.categoryId,
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

  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input: { price: priceAsNumber, ...input } }) => {
      const product = await ctx.db.query.products.findFirst({
        where: (product, { eq }) => eq(product.id, input.id),
      });

      if (!product) throw new Error("not Found");

      const price = priceAsNumber?.toString() || product.price;

      const updated = { ...product, ...input, price };

      await ctx.db
        .update(products)
        .set(updated)
        .where(eq(products.id, input.id));
    }),

  delete: protectedProcedure
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: (product, { eq }) => eq(product.id, input.id),
      });

      if (!product) throw new Error("not Found");

      await ctx.db.delete(products).where(eq(products.id, input.id));
    }),
});
