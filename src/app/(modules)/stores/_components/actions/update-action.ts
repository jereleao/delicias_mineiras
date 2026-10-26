"use server";

import { revalidatePath } from "next/cache";
import type { CreateStoreType } from "~/libs/db/schemas/stores";
import { api } from "~/libs/trpc/server";

export async function updateAction(
  storeId: number,
  storeData: CreateStoreType,
  previousSlug?: string,
) {
  const [store] = await api.store.update({
    id: Number(storeId),
    ...storeData,
  });

  if (!store) return null;

  revalidatePath("/");
  revalidatePath("/stores");
  revalidatePath(`/stores/${store.slug}`);
  if (previousSlug && previousSlug !== store.slug) {
    revalidatePath(`/stores/${previousSlug}`);
  }

  return store;
}
