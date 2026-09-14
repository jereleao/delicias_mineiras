"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function inactivateAction(productId: number | string) {
  await api.banner.update({ id: Number(productId), active: false });

  revalidatePath(getPathByMenuKey("admin.banners"));
}
