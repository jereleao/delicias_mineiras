"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function deleteAction(categoryId: number | string) {
  await api.category.delete({ id: Number(categoryId) });

  revalidatePath("/admin/categories");
}
