"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function activateAction(bannerId: number | string) {
  await api.banner.update({ id: Number(bannerId), active: true });

  revalidatePath(getPathByMenuKey("admin.products"));
}
