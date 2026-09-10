import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import { PASSKEY_PROVIDER_ID } from "~/env";

import { db } from "~/libs/db";
import { users } from "~/libs/db/schema";
import { eq } from "drizzle-orm";

export const PasskeyProvider: Provider = CredentialsProvider({
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
          offerPasskey: false,
        })
        .where(eq(users.id, userData.id));

    return userData ?? null;
  },
});
