"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function addNewCategory(categoryName: string) {
  await api.category.create({ name: categoryName });

  revalidatePath("/admin/categories");
}
