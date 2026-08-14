"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function inactivateAction(productId: number | string) {
  await api.product.update({ id: Number(productId), active: false });

  revalidatePath("/admin/products");
}
