import { api } from "~/libs/trpc/server";
import { Separator } from "~/components/ui/separator";

import { BannerCard } from "./banner-card";
import { BannerCarousel } from "./banner-carousel";

export async function BannerList() {
  const banners = await api.banner.all();

  if (banners.length === 0) return null;

  if (banners.length === 1) {
    const banner = banners.at(0);

    return (
      <>
        <BannerCard banner={banner!} />
        <Separator className="my-4" />
      </>
    );
  }

  return (
    <>
      <BannerCarousel banners={banners} />
      <Separator className="my-4" />
    </>
  );
}
