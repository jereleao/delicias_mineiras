import type { DefaultSession, NextAuthConfig, Profile } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import NodemailerProvider from "next-auth/providers/nodemailer";
import { env } from "~/env";

import { db } from "~/libs/db";
import {
  accounts,
  permissions,
  rolePermissions,
  roles,
  sessions,
  userRoles,
  users,
  verificationTokens,
} from "~/libs/db/schema";
import { eq } from "drizzle-orm";
import type { PermissionKey } from "./menus";
import { PasskeyProvider } from "./providers/passkey";

export type ScopedPermissions = {
  platform: PermissionKey[];
  stores: Record<string, PermissionKey[]>;
};

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    provider: string;
    platformPermissions: PermissionKey[];
  }
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      permissions: ScopedPermissions;
    } & DefaultSession["user"];
    provider: string;
  }
}

export const rpId = env.NEXT_PUBLIC_BASE_URL.replace(
  /^https?:\/\/([^:/]+)(?::\d+)?$/,
  "$1",
);

const getUserPermissions = async (
  userId: string,
): Promise<ScopedPermissions> => {
  const rows = await db
    .select({ storeId: roles.storeId, key: permissions.key })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, userId));

  const platformPermissions = new Set<PermissionKey>();
  const storePermissions = new Map<number, Set<PermissionKey>>();

  for (const { storeId, key } of rows) {
    const permissionKey = key as PermissionKey;
    if (storeId === null) {
      platformPermissions.add(permissionKey);
      continue;
    }

    const permissionSet = storePermissions.get(storeId) ?? new Set();
    permissionSet.add(permissionKey);
    storePermissions.set(storeId, permissionSet);
  }

  const stores: ScopedPermissions["stores"] = {};
  for (const [storeId, permissionSet] of storePermissions) {
    stores[storeId] = [...permissionSet];
  }

  return {
    platform: [...platformPermissions],
    stores,
  };
};

type CurrentUser = {
  email: string;
  id: string;
  name: string | null;
  active: boolean;
  bio: string | null;
  image: string | null;
  emailVerified: Date | null;
  signedIn: boolean;
  offerPasskey: boolean;
};

const updateUserInfo = async (user: CurrentUser, profile: Profile) => {
  const { email, email_verified, name, picture } = profile;

  if (user.email !== email) throw new Error("E-mail Mismatch");

  const updatedUser = {
    name: user.name ?? name,
    image: user.image ?? picture,
    emailVerified: user.emailVerified ?? (email_verified ? new Date() : null),
  };

  await db.update(users).set(updatedUser).where(eq(users.id, user.id));
};

const domain = `.${new URL(env.NEXT_PUBLIC_BASE_URL).hostname}`;

const useSecureCookies = env.NODE_ENV === "production";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  secret: env.AUTH_SECRET,
  trustHost: true,
  providers: [
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
    }),
    NodemailerProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      // sendVerificationRequest({
      //   identifier: email,
      //   url,
      //   provider: { server, from },
      // }) {
      //   // your function
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //   console.log({ email, url, server, from });
      // },
      from: env.EMAIL_FROM,
    }),
    PasskeyProvider,
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain,
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    error: "/auth",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log({ url, baseUrl });
      return baseUrl;
    },
    //         try {
    //           const target = new URL(url, baseUrl);
    //           const base = new URL(baseUrl);
    //           const targetUsesSharedDomain =
    //             target.hostname === authCookieDomain ||
    //             target.hostname.endsWith(`.${authCookieDomain}`);
    //           const baseUsesSharedDomain =
    //             base.hostname === authCookieDomain ||
    //             base.hostname.endsWith(`.${authCookieDomain}`);

    //           if (
    //             target.origin === base.origin ||
    //             (targetUsesSharedDomain &&
    //               baseUsesSharedDomain &&
    //               target.protocol === base.protocol &&
    //               target.port === base.port)
    //           ) {
    //             return target.toString();
    //           }
    //         } catch {
    //           return baseUrl;
    //         }

    //         return baseUrl;
    //       },
    async signIn({ user, account, profile }) {
      console.log("signIn", { user, account, profile });

      if (!user.email) return false;

      const existingUser = await db.query.users.findFirst({
        where: (userRow, { eq }) => eq(userRow.email, user.email as string),
      });

      if (env.REQUIRED_CREATED_USER && !existingUser) return false;

      if (existingUser && !existingUser.signedIn) {
        try {
          await db
            .update(users)
            .set({ signedIn: true })
            .where(eq(users.id, existingUser.id));
        } catch (error) {
          console.error("Failed to update signedIn", {
            error,
            cause: error instanceof Error ? error.cause : undefined,
          });

          throw error;
        }
      }

      // This will get the property from Google, for exemple to set 'emailVerified'

      if (existingUser && profile) {
        await updateUserInfo(existingUser, profile);
      }

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async jwt({ token, user, account, profile, session, trigger }) {
      // console.log("jwt", { token, user, account, profile, session, trigger });

      const resultToken = { ...token };

      if (account) {
        token.provider = account.provider;
      }

      if (user) {
        Object.assign(resultToken, user);
      }

      if (session) {
        Object.assign(resultToken, session);
      }

      const userId = user?.id ?? resultToken.sub ?? resultToken.id;
      resultToken.platformPermissions = userId
        ? (await getUserPermissions(userId)).platform
        : [];

      if (typeof resultToken.image == "string") {
        resultToken.picture = resultToken.image;
      }

      return resultToken;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, token, newSession, user, trigger }) {
      // console.log("session", { session, token, newSession, user, trigger });

      const userId = token.sub || token.id;

      return {
        ...session,
        user: {
          ...session.user,
          id: userId, // Ensure the user ID is included in the session
          permissions: userId
            ? await getUserPermissions(userId)
            : { platform: [], stores: {} },
        },
        provider: token.provider,
      };
    },
  },
} satisfies NextAuthConfig;
