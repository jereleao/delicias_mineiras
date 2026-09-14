"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { api } from "~/libs/trpc/server";

export async function updateAction(code: string, value: string) {
  const configs = await api.config.update({
    code,
    value,
  });

  revalidatePath(getPathByMenuKey("admin.configs"));

  if (configs.length !== 1) return null;

  return configs.at(0);
}
