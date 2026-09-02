import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NEXT_RUNTIME: z.enum(["nodejs", "edge"]).default("nodejs"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    APPLICATION_NAME: z.string(),
    DEFAULT_LANGUAGE: z.string().default("en"),
    DEFAULT_THEME: z.enum(["light", "dark", "system"]).default("system"),
    VERCEL_URL: z.string().optional(),
    PORT: z.coerce.number().optional(),

    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    WEB_AUTHN_CHALLENGE: z.string(),
    REQUIRED_CREATED_USER: z.coerce.boolean().default(false),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),

    SENTRY_AUTH_TOKEN: z.string().optional(),

    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.coerce.number(),
    EMAIL_FROM: z.email(),

    POSTGRES_URL: z.url(),

    BLOB_STORE_ID:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    BLOB_READ_WRITE_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    NODE_ENV: process.env.NODE_ENV,

    APPLICATION_NAME: process.env.APPLICATION_NAME,
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,
    DEFAULT_THEME: process.env.DEFAULT_THEME,
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,

    AUTH_SECRET: process.env.AUTH_SECRET,
    WEB_AUTHN_CHALLENGE: process.env.WEB_AUTHN_CHALLENGE,
    REQUIRED_CREATED_USER: process.env.REQUIRED_CREATED_USER,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,

    POSTGRES_URL: process.env.POSTGRES_URL,

    BLOB_STORE_ID: process.env.BLOB_STORE_ID,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,

    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

export const PASSKEY_PROVIDER_ID = "passkeyProviderId";
