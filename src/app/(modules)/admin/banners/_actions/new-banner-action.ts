"use server";

import { revalidatePath } from "next/cache";
import { getPathByMenuKey } from "~/libs/auth/menus";
import type { CreateBannerType } from "~/libs/db/schemas/banners";
import { api } from "~/libs/trpc/server";

export async function newBannerAction(bannerData: CreateBannerType) {
  const categories = await api.banner.create(bannerData);

  revalidatePath(getPathByMenuKey("admin.banners"));

  if (categories.length !== 1) return null;

  return categories.at(0);
}
