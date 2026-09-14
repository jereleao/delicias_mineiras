"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import type { CreateProductType } from "~/libs/db/schemas/products";
import { api } from "~/libs/trpc/server";

export async function productNewAction(data: CreateProductType) {
  const categories = await api.product.create(data);

  revalidatePath(getPathByMenuKey("admin.products"));

  if (categories.length !== 1) return null;

  return categories.at(0);
}
