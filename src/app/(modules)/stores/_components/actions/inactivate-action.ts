"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function inactivateAction(storeId: number | string) {
  await api.store.update({ id: Number(storeId), active: false });

  revalidatePath("/");
}
