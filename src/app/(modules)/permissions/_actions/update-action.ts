"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";
import type { RoleInput } from "~/libs/db/schemas/permissions";

export async function updateAction(roleId: number, input: RoleInput) {
  const role = await api.permission.updateRole({
    id: roleId,
    name: input.name,
    description: input.description || null,
    permissions: input.permissions || [],
  });

  revalidatePath(getPathByMenuKey("permissions"));
  revalidatePath(getPathByMenuKey("users"));

  return role;
}
