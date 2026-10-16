import { z } from "zod";

const cartProductSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const cartSchema = z.object({
  products: z.array(cartProductSchema),
});

export type Cart = z.infer<typeof cartSchema>;

export function parseCartCookie(value: string | undefined): Cart {
  if (!value) {
    return { products: [] };
  }

  const parsed: unknown = JSON.parse(value);
  const result = cartSchema.safeParse(parsed);

  if (result.success) {
    return result.data;
  }

  if (
    Array.isArray(parsed) &&
    parsed.every(
      (id) => typeof id === "number" && Number.isInteger(id) && id > 0,
    )
  ) {
    const quantities = new Map<number, number>();
    for (const id of parsed) {
      quantities.set(id, (quantities.get(id) ?? 0) + 1);
    }

    return {
      products: [...quantities].map(([id, quantity]) => ({ id, quantity })),
    };
  }

  throw new Error("Cart cookie has an invalid format.");
}
