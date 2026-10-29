"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function deleteAction(roleId: number) {
  await api.permission.deleteRole({ id: roleId });

  revalidatePath(getPathByMenuKey("permissions"));
  revalidatePath(getPathByMenuKey("users"));
}
