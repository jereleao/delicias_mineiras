"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function activateAction(productId: number | string) {
  await api.banner.update({ id: Number(productId), active: true });

  revalidatePath(getPathByMenuKey("admin.products"));
}
