"use server";

import { cookies } from "next/headers";
import { cartSchema, type Cart } from "../_contexts/cart";

export async function saveCart(cart: Cart) {
  const validatedCart = cartSchema.parse(cart);
  const cookieStore = await cookies();
  cookieStore.set("cart_product_ids", JSON.stringify(validatedCart), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
