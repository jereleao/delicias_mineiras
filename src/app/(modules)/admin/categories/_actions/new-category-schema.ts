import * as z from "zod";

export const newCategorySchema = z.object({
  id: z.number(),
  name: z
    .string({ error: "Required" })
    .min(5, "Category name must be at least 5 characters.")
    .max(32, "Category name must be at most 32 characters."),
});

export type NewCategoryType = z.infer<typeof newCategorySchema>;
