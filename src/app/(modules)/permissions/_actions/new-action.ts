"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";
import type { RoleInput } from "~/libs/db/schemas/permissions";

export async function newAction(input: RoleInput) {
  const role = await api.permission.createRole({
    name: input.name,
    description: input.description || null,
    permissions: input.permissions || [],
  });

  revalidatePath(getPathByMenuKey("permissions"));
  revalidatePath(getPathByMenuKey("users"));

  return role;
}
