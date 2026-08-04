import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/libs/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["de_mi_*"],
} satisfies Config;
