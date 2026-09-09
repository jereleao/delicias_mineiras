"use server";

import { revalidatePath } from "next/cache";
import type { CreateBannerType } from "~/libs/db/schemas/banners";
import { api } from "~/libs/trpc/server";

export async function updateBannerAction(
  bannerId: number,
  bannerData: CreateBannerType,
) {
  const banners = await api.banner.update({
    id: Number(bannerId),
    ...bannerData,
  });

  revalidatePath("/admin/banners");

  if (banners.length !== 1) return null;

  return banners.at(0);
}
