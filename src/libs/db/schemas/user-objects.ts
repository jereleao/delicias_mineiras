import { uniqueIndex } from "drizzle-orm/pg-core";
import { createTable } from "~/libs/db/schemas/common";
import { users } from "~/libs/db/schemas/users";

export const userObjects = createTable(
  "user_object",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    keyValue: d.text("key_value").notNull(),
    jsonObject: d.text("json_object").notNull(),
  }),
  (t) => [uniqueIndex("user_object_user_key_idx").on(t.userId, t.keyValue)],
);
