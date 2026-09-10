import {
  pgTable,
  index,
  check,
  integer,
  varchar,
  timestamp,
  boolean,
  foreignKey,
  numeric,
  unique,
  text,
  bigint,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const deMiBanner = pgTable(
  "de_mi_banner",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "de_mi_banner_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    title: varchar({ length: 256 }),
    description: varchar({ length: 256 }),
    imageUrl: varchar({ length: 256 }),
    actionLabel: varchar({ length: 256 }),
    actionUrl: varchar({ length: 256 }),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("banner_title_idx").using(
      "btree",
      table.title.asc().nullsLast().op("text_ops"),
    ),
    check("de_mi_banner_id_not_null", sql`NOT NULL id`),
    check("de_mi_banner_createdAt_not_null", sql`NOT NULL "createdAt"`),
  ],
);

export const deMiUser = pgTable(
  "de_mi_user",
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    name: varchar({ length: 255 }),
    bio: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull(),
    emailVerified: timestamp({ withTimezone: true, mode: "string" }),
    image: varchar({ length: 255 }),
    offerPasskey: boolean(),
  },
  (table) => [
    check("de_mi_user_id_not_null", sql`NOT NULL id`),
    check("de_mi_user_email_not_null", sql`NOT NULL email`),
  ],
);

export const deMiCategory = pgTable(
  "de_mi_category",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "de_mi_category_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: varchar({ length: 256 }).notNull(),
    createdById: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("category_created_by_idx").using(
      "btree",
      table.createdById.asc().nullsLast().op("text_ops"),
    ),
    index("category_name_idx").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [deMiUser.id],
      name: "de_mi_category_createdById_de_mi_user_id_fk",
    }),
    check("de_mi_category_id_not_null", sql`NOT NULL id`),
    check("de_mi_category_name_not_null", sql`NOT NULL name`),
    check("de_mi_category_createdById_not_null", sql`NOT NULL "createdById"`),
    check("de_mi_category_createdAt_not_null", sql`NOT NULL "createdAt"`),
  ],
);

export const deMiProduct = pgTable(
  "de_mi_product",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "de_mi_product_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    categoryId: integer().notNull(),
    name: varchar({ length: 256 }),
    description: varchar({ length: 256 }),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    imageUrl: varchar({ length: 256 }),
    keywords: varchar({ length: 256 }),
    createdById: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("product_created_by_idx").using(
      "btree",
      table.createdById.asc().nullsLast().op("text_ops"),
    ),
    index("product_name_idx").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [deMiCategory.id],
      name: "de_mi_product_categoryId_de_mi_category_id_fk",
    }),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [deMiUser.id],
      name: "de_mi_product_createdById_de_mi_user_id_fk",
    }),
    check("de_mi_product_id_not_null", sql`NOT NULL id`),
    check("de_mi_product_categoryId_not_null", sql`NOT NULL "categoryId"`),
    check("de_mi_product_price_not_null", sql`NOT NULL price`),
    check("de_mi_product_createdById_not_null", sql`NOT NULL "createdById"`),
    check("de_mi_product_createdAt_not_null", sql`NOT NULL "createdAt"`),
  ],
);

export const deMiSession = pgTable(
  "de_mi_session",
  {
    sessionToken: varchar({ length: 255 }).primaryKey().notNull(),
    userId: varchar({ length: 255 }).notNull(),
    expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    index("session_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [deMiUser.id],
      name: "de_mi_session_userId_de_mi_user_id_fk",
    }),
    check("de_mi_session_sessionToken_not_null", sql`NOT NULL "sessionToken"`),
    check("de_mi_session_userId_not_null", sql`NOT NULL "userId"`),
    check("de_mi_session_expires_not_null", sql`NOT NULL expires`),
  ],
);

export const deMiCredentials = pgTable(
  "de_mi_credentials",
  {
    // TODO: failed to parse database type 'bytea'
    credentialId: unknown("credentialID").notNull(),
    userId: text().notNull(),
    providerAccountId: text(),
    credentialPublicKey: text().notNull(),
    counter: integer().notNull(),
    credentialDeviceType: text().notNull(),
    credentialBackedUp: boolean().notNull(),
    transports: text(),
    authenticatorAttachment: text().default("undefined").notNull(),
    browser: text(),
    os: text(),
    platform: text(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lastUsed: bigint("last_used", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdAt: bigint("created_at", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [deMiUser.id],
      name: "de_mi_credentials_userId_de_mi_user_id_fk",
    }).onDelete("cascade"),
    unique("de_mi_credentials_credentialID_unique").on(table.credentialId),
    check(
      "de_mi_credentials_credentialID_not_null",
      sql`NOT NULL "credentialID"`,
    ),
    check("de_mi_credentials_userId_not_null", sql`NOT NULL "userId"`),
    check(
      "de_mi_credentials_credentialPublicKey_not_null",
      sql`NOT NULL "credentialPublicKey"`,
    ),
    check("de_mi_credentials_counter_not_null", sql`NOT NULL counter`),
    check(
      "de_mi_credentials_credentialDeviceType_not_null",
      sql`NOT NULL "credentialDeviceType"`,
    ),
    check(
      "de_mi_credentials_credentialBackedUp_not_null",
      sql`NOT NULL "credentialBackedUp"`,
    ),
    check(
      "de_mi_credentials_authenticatorAttachment_not_null",
      sql`NOT NULL "authenticatorAttachment"`,
    ),
  ],
);

export const deMiVerificationToken = pgTable(
  "de_mi_verification_token",
  {
    identifier: varchar({ length: 255 }).notNull(),
    token: varchar({ length: 255 }).notNull(),
    expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.token, table.identifier],
      name: "de_mi_verification_token_identifier_token_pk",
    }),
    check(
      "de_mi_verification_token_identifier_not_null",
      sql`NOT NULL identifier`,
    ),
    check("de_mi_verification_token_token_not_null", sql`NOT NULL token`),
    check("de_mi_verification_token_expires_not_null", sql`NOT NULL expires`),
  ],
);

export const deMiAccount = pgTable(
  "de_mi_account",
  {
    userId: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 255 }).notNull(),
    provider: varchar({ length: 255 }).notNull(),
    providerAccountId: varchar({ length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: varchar({ length: 255 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
  },
  (table) => [
    index("account_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [deMiUser.id],
      name: "de_mi_account_userId_de_mi_user_id_fk",
    }),
    primaryKey({
      columns: [table.providerAccountId, table.provider],
      name: "de_mi_account_provider_providerAccountId_pk",
    }),
    check("de_mi_account_userId_not_null", sql`NOT NULL "userId"`),
    check("de_mi_account_type_not_null", sql`NOT NULL type`),
    check("de_mi_account_provider_not_null", sql`NOT NULL provider`),
    check(
      "de_mi_account_providerAccountId_not_null",
      sql`NOT NULL "providerAccountId"`,
    ),
  ],
);
