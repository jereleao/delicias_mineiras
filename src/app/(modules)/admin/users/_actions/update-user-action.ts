"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";
import type { UserFormType } from "./user-schema";
import { getPathByMenuKey } from "~/libs/auth/menus";

export async function updateUserAction(userId: string, user: UserFormType) {
  const newUsers = await api.user.update({
    id: userId,
    name: user.name,
    bio: user.bio,
    roleId: user.roleId,
  });

  revalidatePath(getPathByMenuKey("admin.users"));

  if (newUsers.length !== 1) return null;

  return newUsers.at(0);
}
