"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import type { CreateStoreType } from "~/libs/db/schemas/stores";
import { api } from "~/libs/trpc/server";

export async function updateAction(
  storeId: number,
  storeData: CreateStoreType,
) {
  const [store] = await api.store.update({
    id: Number(storeId),
    ...storeData,
  });

  revalidatePath(getPathByMenuKey("admin.banners"));

  if (!store) return null;

  return store;
}
