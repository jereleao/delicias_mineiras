"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function deleteAction(storeId: number | string) {
  await api.store.delete({ id: Number(storeId) });

  revalidatePath("/");
}
