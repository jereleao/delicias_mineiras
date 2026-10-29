"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";
import type { UserFormType } from "./user-schema";
import { getPathByMenuKey } from "~/libs/auth/menus";

export async function updateAction(userId: string, user: UserFormType) {
  const newUsers = await api.user.updateStore({
    id: userId,
    roleIds: user.roleIds,
  });

  revalidatePath(getPathByMenuKey("store.users"));

  if (newUsers.length !== 1) return null;

  return newUsers.at(0);
}
