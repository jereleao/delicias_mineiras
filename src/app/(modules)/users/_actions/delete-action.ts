"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function deleteAction(userId: string) {
  await api.user.deletePlatform({ id: userId });

  revalidatePath(getPathByMenuKey("users"));
}
