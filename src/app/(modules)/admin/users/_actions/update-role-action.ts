"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function updateRoleAction(userId: string, roleId: number) {
  await api.user.updateRole({ userId, roleId });

  revalidatePath(getPathByMenuKey("admin.users"));
}
