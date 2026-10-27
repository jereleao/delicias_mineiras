import type { inferRouterOutputs } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  permissionProcedure,
  protectedProcedure,
  publicProcedure,
  storePermissionProcedure,
} from "~/libs/api/trpc";
import { db } from "~/libs/db";
import { roles, userRoles, users } from "~/libs/db/schema";
import { inviteSchema } from "~/libs/db/schemas/users";

type UserOutputs = inferRouterOutputs<typeof userRouter>;

export type ExistingKey = UserOutputs["existingKeys"][number];

export type User = UserOutputs["allPlatform"][number];

export type GetAllUsersResponse = Array<User>;

export type GetExistingKeysResponse = Array<ExistingKey>;

export type MyUserData = NonNullable<UserOutputs["me"]>;

const roleIdsSchema = z
  .array(z.number().int().positive())
  .refine((roleIds) => new Set(roleIds).size === roleIds.length);

type AssignmentDb = Pick<typeof db, "select" | "insert" | "delete">;

async function validateRoleIds(
  database: AssignmentDb,
  roleIds: number[],
  storeId: number | null,
) {
  const uniqueRoleIds = [...new Set(roleIds)];
  const roleRows = await database
    .select({ id: roles.id })
    .from(roles)
    .where(
      and(
        inArray(roles.id, uniqueRoleIds),
        storeId === null
          ? isNull(roles.storeId)
          : eq(roles.storeId, storeId),
      ),
    );

  if (roleRows.length !== uniqueRoleIds.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "One or more selected roles are outside this scope.",
    });
  }
}

async function replaceRoleAssignments(
  database: AssignmentDb,
  userId: string,
  roleIds: number[],
  storeId: number | null,
) {
  const currentRoles = await database
    .select({ roleId: userRoles.roleId })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(
      and(
        eq(userRoles.userId, userId),
        storeId === null
          ? isNull(roles.storeId)
          : eq(roles.storeId, storeId),
      ),
    );

  if (currentRoles.length > 0) {
    await database
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          inArray(
            userRoles.roleId,
            currentRoles.map(({ roleId }) => roleId),
          ),
        ),
      );
  }

  if (roleIds.length > 0) {
    await database.insert(userRoles).values(
      roleIds.map((roleId) => ({
        userId,
        roleId,
      })),
    );
  }
}

async function getUsersInScope(
  database: typeof db,
  storeId: number | null,
) {
  const people = await database
    .select({
      id: users.id,
      bio: users.bio,
      name: users.name,
      email: users.email,
      image: users.image,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .orderBy(users.id);

  const assignments = await database
    .select({
      userId: userRoles.userId,
      roleId: userRoles.roleId,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(
      storeId === null
        ? isNull(roles.storeId)
        : eq(roles.storeId, storeId),
    );

  const roleIdsByUser = new Map<string, number[]>();
  for (const { userId, roleId } of assignments) {
    const userRoleIds = roleIdsByUser.get(userId) ?? [];
    userRoleIds.push(roleId);
    roleIdsByUser.set(userId, userRoleIds);
  }

  return people
    .filter((user) => storeId === null || roleIdsByUser.has(user.id))
    .map((user) => ({
      ...user,
      roleIds: roleIdsByUser.get(user.id) ?? [],
    }));
}

export const userRouter = createTRPCRouter({
  allPlatform: permissionProcedure("users").query(async ({ ctx }) => {
    return getUsersInScope(ctx.db, null);
  }),

  allStore: storePermissionProcedure("store.users").query(async ({ ctx }) => {
    return getUsersInScope(ctx.db, ctx.store.id);
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

  getById: permissionProcedure("users")
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const usersInScope = await getUsersInScope(ctx.db, null);
      return usersInScope.find((user) => user.id === input.id) ?? null;
    }),

  getByEmail: publicProcedure.input(z.email()).query(async ({ ctx, input }) => {
    const userData = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, input),
    });

    return userData ?? null;
  }),

  invitePlatform: permissionProcedure("users:manage")
    .input(inviteSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        await validateRoleIds(tx, input.roleIds, null);
        const [existingUser] = await tx
          .select({
            id: users.id,
            bio: users.bio,
            name: users.name,
            email: users.email,
            image: users.image,
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);
        const [newUser] = existingUser
          ? [existingUser]
          : await tx
              .insert(users)
              .values({ email: input.email })
              .returning({
                id: users.id,
                bio: users.bio,
                name: users.name,
                email: users.email,
                image: users.image,
                emailVerified: users.emailVerified,
              });

        if (!newUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user.",
          });
        }

        const currentRoleIds = await tx
          .select({ roleId: userRoles.roleId })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(and(eq(userRoles.userId, newUser.id), isNull(roles.storeId)));
        const roleIds = [
          ...new Set([
            ...currentRoleIds.map(({ roleId }) => roleId),
            ...input.roleIds,
          ]),
        ];
        await replaceRoleAssignments(tx, newUser.id, roleIds, null);
        return [{ ...newUser, roleIds }];
      }),
    ),

  inviteStore: storePermissionProcedure("store.users:manage")
    .input(inviteSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        await validateRoleIds(tx, input.roleIds, ctx.store.id);
        const [existingUser] = await tx
          .select({
            id: users.id,
            bio: users.bio,
            name: users.name,
            email: users.email,
            image: users.image,
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);
        const [newUser] = existingUser
          ? [existingUser]
          : await tx
              .insert(users)
              .values({ email: input.email })
              .returning({
                id: users.id,
                bio: users.bio,
                name: users.name,
                email: users.email,
                image: users.image,
                emailVerified: users.emailVerified,
              });

        if (!newUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create or load user.",
          });
        }

        const currentRoleIds = await tx
          .select({ roleId: userRoles.roleId })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(
            and(
              eq(userRoles.userId, newUser.id),
              eq(roles.storeId, ctx.store.id),
            ),
          );
        const roleIds = [
          ...new Set([
            ...currentRoleIds.map(({ roleId }) => roleId),
            ...input.roleIds,
          ]),
        ];
        await replaceRoleAssignments(
          tx,
          newUser.id,
          roleIds,
          ctx.store.id,
        );
        return [{ ...newUser, roleIds }];
      }),
    ),

  updatePlatform: permissionProcedure("users:edit")
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        bio: z.string().optional(),
        image: z.string().optional(),
        roleIds: roleIdsSchema,
      }),
    )
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        await validateRoleIds(tx, input.roleIds, null);
        const [updated] = await tx
          .update(users)
          .set({
            name: input.name,
            bio: input.bio,
            image: input.image,
          })
          .where(eq(users.id, input.id))
          .returning({
            id: users.id,
            bio: users.bio,
            name: users.name,
            email: users.email,
            image: users.image,
            emailVerified: users.emailVerified,
          });

        if (!updated) return [];

        await replaceRoleAssignments(tx, updated.id, input.roleIds, null);
        return [{ ...updated, roleIds: input.roleIds }];
      }),
    ),

  updateStore: storePermissionProcedure("store.users:edit")
    .input(
      z.object({
        id: z.string(),
        roleIds: roleIdsSchema,
      }),
    )
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        await validateRoleIds(tx, input.roleIds, ctx.store.id);
        const [updated] = await tx
          .select({
            id: users.id,
            bio: users.bio,
            name: users.name,
            email: users.email,
            image: users.image,
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(eq(users.id, input.id))
          .limit(1);

        if (!updated) return [];

        await replaceRoleAssignments(
          tx,
          updated.id,
          input.roleIds,
          ctx.store.id,
        );
        return [{ ...updated, roleIds: input.roleIds }];
      }),
    ),

  deletePlatform: permissionProcedure("users:manage")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .delete(users)
        .where(eq(users.id, input.id))
        .returning({ id: users.id });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }
    }),

  removeFromStore: storePermissionProcedure("store.users:manage")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const scopedRoles = await ctx.db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(
          and(
            eq(userRoles.userId, input.id),
            eq(roles.storeId, ctx.store.id),
          ),
        );

      if (scopedRoles.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found in store.",
        });
      }

      await ctx.db
        .delete(userRoles)
        .where(
          and(
            eq(userRoles.userId, input.id),
            inArray(
              userRoles.roleId,
              scopedRoles.map(({ roleId }) => roleId),
            ),
          ),
        );
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
});
