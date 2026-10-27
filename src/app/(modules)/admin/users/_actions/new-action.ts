"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import type { InviteType } from "~/libs/db/schemas/users";
import { api } from "~/libs/trpc/server";

export async function newAction(inviteData: InviteType) {
  const users = await api.user.inviteStore(inviteData);

  revalidatePath(getPathByMenuKey("store.users"));

  if (users.length !== 1) return null;

  return users.at(0);
}
