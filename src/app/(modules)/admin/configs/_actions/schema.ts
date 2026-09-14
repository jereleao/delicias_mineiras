import * as z from "zod";

export const bannerSchema = z.object({
  id: z.number(),
  title: z
    .string({ error: "Required" })
    .min(5, "Banner title must be at least 5 characters.")
    .max(32, "Banner title must be at most 32 characters."),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters.")
    .nullable(),
  imageUrl: z.string({ error: "Upload a product image." }),
});

export type BannerFormType = z.infer<typeof bannerSchema>;
