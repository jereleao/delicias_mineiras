"use server";

import { del } from "@vercel/blob";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";
import { getPathByMenuKey } from "~/libs/auth/menus";

export async function deleteAction(productId: number | string) {
  const { imageUrl } = await api.product.delete({ id: Number(productId) });

  if (imageUrl) {
    try {
      await del(imageUrl);
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  revalidatePath(getPathByMenuKey("admin.products"));
}
