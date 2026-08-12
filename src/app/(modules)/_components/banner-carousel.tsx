"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { BannerCard, type Banner } from "./banner-card";

type BannerCarouselProps = {
  banners: Banner[];
};

export function BannerCarousel({ banners }: BannerCarouselProps) {
  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem key={index} className="w-full">
            <BannerCard banner={banner!} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
