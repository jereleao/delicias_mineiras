import type { inferRouterOutputs } from "@trpc/server";
import { eq } from "drizzle-orm";
import { string, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/libs/api/trpc";
import { users } from "~/libs/db/schema";

type UserOutputs = inferRouterOutputs<typeof userRouter>;

export type ExistingKey = UserOutputs["existingKeys"][number];

export type GetExistingKeysResponse = Array<ExistingKey>;

export type UserData = NonNullable<UserOutputs["me"]>;

export const userRouter = createTRPCRouter({
  me: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;

    if (!userId) throw new Error("Unauthorized");

    const userData = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });

    return userData ?? null;
  }),

  existingKeys: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;

    if (!userId) throw new Error("Unauthorized");

    const existingKeys = await ctx.db.query.storedCredentials.findMany({
      where: (key, { eq }) => eq(key.userId, userId),
    });

    return existingKeys;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userData = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });

      return userData ?? null;
    }),

  disablePasskey: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.user.id;

    if (!userId) throw new Error("Unauthorized");

    await ctx.db
      .update(users)
      .set({
        disablePasskey: true,
      })
      .where(eq(users.id, userId));
  }),

  updateMe: protectedProcedure
    .input(
      z.object({
        name: string(),
        bio: string().optional(),
        image: string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      if (!userId) throw new Error("Unauthorized");

      await ctx.db
        .update(users)
        .set({
          name: input.name,
          bio: input.bio,
          image: input.image,
        })
        .where(eq(users.id, userId));
    }),
});
