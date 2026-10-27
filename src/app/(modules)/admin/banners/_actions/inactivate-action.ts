"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function inactivateAction(bannerId: number | string) {
  await api.banner.update({ id: Number(bannerId), active: false });

  revalidatePath(getPathByMenuKey("store.banners"));
}
