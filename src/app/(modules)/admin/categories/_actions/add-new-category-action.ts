"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function addNewCategory(categoryName: string) {
  const categories = await api.category.create({ name: categoryName });

  revalidatePath("/admin/categories");

  if (categories.length !== 1) return null;

  return categories.at(0);
}
