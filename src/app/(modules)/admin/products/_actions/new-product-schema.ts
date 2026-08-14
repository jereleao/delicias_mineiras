import * as z from "zod";

const europeanNumberSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const sanitized = val.replace(",", ".");

      console.debug("TODO: Add a message to thousands");

      return sanitized === "" ? undefined : Number(sanitized);
    }
    return val;
  },
  z.number({ message: "Invalid number format" }),
);

export const MAX_KEYWORD_COUNT = 11;

export const newProductSchema = z.object({
  id: z.number(),
  categoryId: z.coerce.number({ error: "Required" }),
  name: z
    .string({ error: "Required" })
    .min(5, "Product name must be at least 5 characters.")
    .max(32, "Product name must be at most 32 characters."),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters.")
    .nullable(),
  price: europeanNumberSchema,
  imageUrl: z.string({ error: "Upload a product image." }),
  keywords: z
    .array(
      z.object({
        word: z.string().min(3, "Key word must be at least 3 characters."),
      }),
    )
    .max(MAX_KEYWORD_COUNT, `You can add up to ${MAX_KEYWORD_COUNT} key words.`)
    .nullable(),
});

export type NewProductType = z.infer<typeof newProductSchema>;

export type NewProductFormType = Omit<
  NewProductType,
  "price" | "categoryId"
> & {
  categoryId: unknown;
  price: unknown;
};
