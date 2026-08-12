import z from "zod";
import { pgTableCreator } from "drizzle-orm/pg-core";

export const byIdSchema = z.object({ id: z.number() });

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `de_mi_${name}`);
