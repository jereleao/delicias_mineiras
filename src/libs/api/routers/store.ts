import type { inferRouterOutputs } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import {
  createTRPCRouter,
  permissionProcedure,
  protectedProcedure,
} from "~/libs/api/trpc";
import { storeDomains, stores } from "~/libs/db/schema";
import { byIdSchema } from "~/libs/db/schemas/common";
import { createStoreSchema, updateStoreSchema } from "~/libs/db/schemas/stores";

type StoreOutputs = inferRouterOutputs<typeof storeRouter>;

export type Store = StoreOutputs["all"][number];

export type GetStoreResponse = Array<Store>;

export const storeRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    console.warn("TODO: only get allowed stores for the current user");

    const storesWithDomains = await ctx.db
      .select({
        id: stores.id,
        name: stores.name,
        slug: stores.slug,
        active: stores.active,
        domains: sql<string[]>`
          coalesce(
            array_agg(${storeDomains.domain}) filter (where ${storeDomains.id} is not null),
            array[]::varchar[]
          )
        `,
      })
      .from(stores)
      .leftJoin(storeDomains, eq(stores.id, storeDomains.storeId))
      .groupBy(stores.id, stores.name, stores.slug, stores.active)
      .orderBy(stores.createdAt);

    return storesWithDomains ?? null;
  }),

  getById: permissionProcedure("stores")
    .input(byIdSchema)
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.query.stores.findFirst({
        where: (store, { eq }) => eq(store.id, input.id),
      });
      if (!store) throw new Error("not Found");

      return store ?? null;
    }),

  create: permissionProcedure("stores:manage")
    .input(createStoreSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [newStore] = await tx
          .insert(stores)
          .values({ name: input.name, slug: input.slug })
          .returning({
            id: stores.id,
            name: stores.name,
            slug: stores.slug,
            active: stores.active,
          });

        if (!newStore) {
          throw new Error("Failed to create store.");
        }

        if (input.domains.length > 0) {
          await tx.insert(storeDomains).values(
            input.domains.map(({ domain }) => ({
              storeId: newStore.id,
              domain,
            })),
          );
        }

        const domains = input.domains.map((d) => d.domain);

        return [{ ...newStore, domains }];
      });
    }),

  update: permissionProcedure("stores:edit")
    .input(updateStoreSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [existingStore] = await tx
          .select({
            id: stores.id,
            name: stores.name,
            slug: stores.slug,
            active: stores.active,
          })
          .from(stores)
          .where(eq(stores.id, input.id))
          .limit(1);

        if (!existingStore) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Store not found.",
          });
        }

        const storeChanges = {
          name: input.name,
          slug: input.slug,
          active: input.active,
        };
        const hasStoreChanges = Object.values(storeChanges).some(
          (value) => value !== undefined,
        );

        let updatedStore = existingStore;
        if (hasStoreChanges) {
          const [store] = await tx
            .update(stores)
            .set(storeChanges)
            .where(eq(stores.id, input.id))
            .returning({
              id: stores.id,
              name: stores.name,
              slug: stores.slug,
              active: stores.active,
            });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Store not found.",
            });
          }

          updatedStore = store;
        }

        if (input.domains !== undefined) {
          await tx
            .delete(storeDomains)
            .where(eq(storeDomains.storeId, input.id));

          if (input.domains.length > 0) {
            await tx.insert(storeDomains).values(
              input.domains.map(({ domain }) => ({
                storeId: input.id,
                domain,
              })),
            );
          }
        }

        const domains = input.domains
          ? input.domains.map((d) => d.domain)
          : (
              await tx
                .select({ domain: storeDomains.domain })
                .from(storeDomains)
                .where(eq(storeDomains.storeId, input.id))
            ).map(({ domain }) => domain);

        return [{ ...updatedStore, domains }];
      });
    }),

  delete: permissionProcedure("stores:manage")
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.db.query.stores.findFirst({
        where: (store, { eq }) => eq(store.id, input.id),
      });

      if (!store) throw new Error("not Found");

      await ctx.db.delete(stores).where(eq(stores.id, input.id));
    }),
});
