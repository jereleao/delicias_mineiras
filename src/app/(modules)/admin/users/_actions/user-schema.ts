import * as z from "zod";

export const userFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(5, "User name must be at least 5 characters.")
    .max(32, "User name must be at most 32 characters."),
  bio: z.string().max(255, "'Bio' must be at most 255 characters.").optional(),
  roleId: z.coerce.number(),
});

export type UserFormType = z.infer<typeof userFormSchema>;
