import type { inferRouterOutputs } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  permissionProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/libs/api/trpc";
import { users } from "~/libs/db/schema";
import { inviteSchema } from "~/libs/db/schemas/users";

type UserOutputs = inferRouterOutputs<typeof userRouter>;

export type ExistingKey = UserOutputs["existingKeys"][number];

export type User = UserOutputs["all"][number];

export type GetAllUsersResponse = Array<User>;

export type GetExistingKeysResponse = Array<ExistingKey>;

export type MyUserData = NonNullable<UserOutputs["me"]>;

export const userRouter = createTRPCRouter({
  all: permissionProcedure("admin.users").query(async ({ ctx }) => {
    const usersWithRole = await ctx.db
      .select({
        id: users.id,
        bio: users.bio,
        name: users.name,
        email: users.email,
        image: users.image,
        emailVerified: users.emailVerified,
        roleId: users.roleId,
      })
      .from(users)
      .orderBy(users.id);

    return usersWithRole ?? null;
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userData = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });

    return userData ?? null;
  }),

  existingKeys: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const existingKeys = await ctx.db.query.storedCredentials.findMany({
      where: (key, { eq }) => eq(key.userId, userId),
    });

    return existingKeys;
  }),

  getById: permissionProcedure("admin.users")
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userData = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });

      return userData ?? null;
    }),

  getByEmail: publicProcedure.input(z.email()).query(async ({ ctx, input }) => {
    const userData = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, input),
    });

    return userData ?? null;
  }),

  invite: permissionProcedure("admin.users:manage")
    .input(inviteSchema)
    .mutation(async ({ ctx, input }) => {
      const newUser = await ctx.db
        .insert(users)
        .values({
          email: input.email,
          roleId: input.roleId,
        })
        .returning({
          id: users.id,
          bio: users.bio,
          name: users.name,
          email: users.email,
          image: users.image,
          emailVerified: users.emailVerified,
          roleId: users.roleId,
        });
      return newUser;
    }),

  updateRole: permissionProcedure("admin.users:edit")
    .input(z.object({ userId: z.string(), roleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const role = await ctx.db.query.roles.findFirst({
        where: (role, { eq }) => eq(role.id, input.roleId),
      });

      if (!role) throw new Error("not Found");

      await ctx.db
        .update(users)
        .set({
          roleId: input.roleId,
        })
        .where(eq(users.id, input.userId));
    }),

  update: permissionProcedure("admin.users:edit")
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        bio: z.string().optional(),
        image: z.string().optional(),
        roleId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(users)
        .set({
          name: input.name,
          bio: input.bio,
          image: input.image,
          roleId: input.roleId,
        })
        .where(eq(users.id, input.id))
        .returning({
          id: users.id,
          bio: users.bio,
          name: users.name,
          email: users.email,
          image: users.image,
          emailVerified: users.emailVerified,
          roleId: users.roleId,
        });

      return updated;
    }),

  dismissPasskey: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.db
      .update(users)
      .set({
        offerPasskey: false,
      })
      .where(eq(users.id, userId));
  }),

  updateMe: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db
        .update(users)
        .set({
          name: input.name,
          bio: input.bio,
          image: input.image,
        })
        .where(eq(users.id, userId));
    }),

  delete: permissionProcedure("admin.users")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });

      if (!user) throw new Error("not Found");

      await ctx.db.delete(users).where(eq(users.id, input.id));
    }),
});
