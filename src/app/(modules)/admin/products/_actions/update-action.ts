"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import type { UpdateProductType } from "~/libs/db/schemas/products";
import { api } from "~/libs/trpc/server";

export async function updateAction(data: UpdateProductType) {
  const banners = await api.product.update({
    ...data,
  });

  revalidatePath(getPathByMenuKey("admin.products"));

  if (banners.length !== 1) return null;

  return banners.at(0);
}
