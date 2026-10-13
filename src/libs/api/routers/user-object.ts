import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/libs/api/trpc";
import { userObjects } from "~/libs/db/schema";

export const userObjectRouter = createTRPCRouter({
  getByKey: protectedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userObject = await ctx.db.query.userObjects.findFirst({
        where: (object, { and, eq }) =>
          and(
            eq(object.userId, ctx.session.user.id),
            eq(object.keyValue, input.key),
          ),
        columns: { jsonObject: true },
      });

      return userObject
        ? { value: JSON.parse(userObject.jsonObject) as unknown }
        : null;
    }),

  createOrUpdate: protectedProcedure
    .input(
      z.object({
        key: z.string().min(1),
        value: z
          .unknown()
          .refine((value) => JSON.stringify(value) !== undefined),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const jsonObject = JSON.stringify(input.value);
      if (jsonObject === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Configuration value must be JSON serializable.",
        });
      }

      await ctx.db
        .insert(userObjects)
        .values({
          userId: ctx.session.user.id,
          keyValue: input.key,
          jsonObject,
        })
        .onConflictDoUpdate({
          target: [userObjects.userId, userObjects.keyValue],
          set: { jsonObject },
        });

      return { value: input.value };
    }),
});
