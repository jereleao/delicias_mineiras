"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function activateAction(productId: number | string) {
  await api.product.update({ id: Number(productId), active: true });

  revalidatePath("/admin/products");
}
