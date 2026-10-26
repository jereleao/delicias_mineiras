"use server";

import { revalidatePath } from "next/cache";
import type { CreateStoreType } from "~/libs/db/schemas/stores";
import { api } from "~/libs/trpc/server";

export async function newAction(storeData: CreateStoreType) {
  const [store] = await api.store.create(storeData);

  revalidatePath("/");
  revalidatePath("/stores");

  if (!store) return null;

  return store;
}
