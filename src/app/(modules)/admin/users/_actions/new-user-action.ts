"use server";

import { revalidatePath } from "next/cache";
import type { InviteType } from "~/libs/db/schemas/users";
import { api } from "~/libs/trpc/server";

export async function newUserAction(inviteData: InviteType) {
  const users = await api.user.invite(inviteData);

  revalidatePath("/admin/users");

  if (users.length !== 1) return null;

  return users.at(0);
}
