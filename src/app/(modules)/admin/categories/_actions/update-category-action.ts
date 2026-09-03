"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function updateCategoryAction(
  categoryId: number | string,
  categoryName: string,
) {
  const categories = await api.category.update({
    id: Number(categoryId),
    name: categoryName,
  });

  revalidatePath("/admin/categories");

  if (categories.length !== 1) return null;

  return categories.at(0);
}
