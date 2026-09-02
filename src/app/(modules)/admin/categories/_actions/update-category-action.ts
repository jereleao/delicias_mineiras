"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function updateCategoryAction(
  categoryId: number | string,
  categoryName: string,
) {
  await api.category.update({ id: Number(categoryId), name: categoryName });

  revalidatePath("/admin/categories");
}
