"use server";

import { del } from "@vercel/blob";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "~/libs/trpc/server";

export async function deleteAction(bannerId: number | string) {
  const { imageUrl } = await api.banner.delete({ id: Number(bannerId) });

  if (imageUrl) {
    try {
      await del(imageUrl);
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  revalidatePath("/admin/banners");
}
