"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function deleteAction(categoryId: number | string) {
  await api.category.delete({ id: Number(categoryId) });

  revalidatePath(getPathByMenuKey("admin.categories"));
}
