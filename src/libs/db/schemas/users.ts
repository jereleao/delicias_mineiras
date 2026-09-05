import { customType, index, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createTable } from "~/libs/db/schemas/common";
import { roles } from "~/libs/db/schemas/permissions";

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roleId: d
    .integer()
    .references(() => roles.id)
    .notNull(),
  name: d.varchar({ length: 255 }),
  bio: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .$defaultFn(() => /* @__PURE__ */ new Date()),
  image: d.varchar({ length: 255 }),
  disablePasskey: d.boolean(),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

const bytea = customType<{ data: Uint8Array; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
  toDriver(value) {
    // Convert Uint8Array to Node.js Buffer for the driver
    return Buffer.from(value);
  },
  fromDriver(value) {
    // Convert database Buffer back to Uint8Array
    return new Uint8Array(value);
  },
});

export const storedCredentials = createTable(
  "credentials",
  (d) => ({
    credentialID: bytea("credentialID").notNull().unique(),
    userId: d
      .text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: d.text(),
    credentialPublicKey: d.text().notNull(),
    counter: d.integer().notNull(),
    credentialDeviceType: d.text().notNull(), // 'singleDevice' | 'multiDevice'
    credentialBackedUp: d.boolean().notNull(),
    transports: d.text(),
    authenticatorAttachment: d.text().notNull().default("undefined"), // "platform" | "cross-platform" | "undefined"
    browser: d.text(),
    os: d.text(),
    platform: d.text(),
    lastUsed: d.bigint("last_used", { mode: "number" }), // A number representing the timestamp, in milliseconds
    createdAt: d.bigint("created_at", { mode: "number" }), // A number representing the timestamp, in milliseconds
  }),
  (t) => [
    {
      compositePK: primaryKey({
        columns: [t.userId, t.credentialID],
      }),
    },
  ],
);
