import type { Provider } from "next-auth/providers";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { z } from "zod";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import NodemailerProvider from "next-auth/providers/nodemailer";
import CredentialsProvider from "next-auth/providers/credentials";
import { env, PASSKEY_PROVIDER_ID } from "~/env";

import { db } from "~/libs/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/libs/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    provider: string;
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
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
    provider: string;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const zSchema = z.object({
  authenticatorAttachment: z.enum(["platform", "cross-platform"]),
  clientExtensionResults: z.object({}),
  id: z.string().min(1),
  rawId: z.string().min(1),
  response: z.object({
    authenticatorData: z.string(),
    clientDataJSON: z.string().min(1),
    userHandle: z.string().optional(),
    signature: z.string(),
  }),
  type: z.literal("public-key"),
});

export const rpId = env.NEXT_PUBLIC_BASE_URL.replace(
  /^https?:\/\/([^:/]+)(?::\d+)?$/,
  "$1",
);

const PasskeyProvider: Provider = CredentialsProvider({
  id: PASSKEY_PROVIDER_ID,
  name: "Passkey Login",

  credentials: {
    userId: { label: "userId", type: "text" },
  },

  async authorize(credentials) {
    const userData = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, credentials.userId as string),
    });

    if (userData)
      db.update(users)
        .set({
          disablePasskey: false,
        })
        .where(eq(users.id, userData.id));

    return userData ?? null;
  },
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  secret: env.AUTH_SECRET,
  trustHost: true,
  providers: [
    GoogleProvider,
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
  callbacks: {
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

      if (typeof resultToken.image == "string") {
        resultToken.picture = resultToken.image;
      }

      return resultToken;
    },
    session({ session, token, user, newSession, trigger }) {
      // console.log("session", { session, token, user, newSession, trigger });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub || token.id, // Ensure the user ID is included in the session
        },
        provider: token.provider,
      };
    },
  },
} satisfies NextAuthConfig;
