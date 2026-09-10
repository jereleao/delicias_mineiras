"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function deleteAction(userId: string) {
  await api.user.delete({ id: userId });

  revalidatePath("/admin/users");
}
