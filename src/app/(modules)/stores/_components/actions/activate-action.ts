"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function activateAction(storeId: number | string) {
  await api.store.update({ id: Number(storeId), active: true });

  revalidatePath("/");
}
