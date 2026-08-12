"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export type Banner = {
  id: number;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  actionLabel: string | null;
  actionUrl: string | null;
};

type BannerCardProps = {
  banner: Banner;
};

export function BannerCard({ banner }: BannerCardProps) {
  return (
    <Card className="mt-2 p-0">
      <CardContent className="relative flex items-center justify-center p-0">
        <Image
          src={banner.imageUrl!}
          alt={banner.description ?? "Banner Image"}
          width={600}
          height={400}
          className="h-30 w-full object-cover"
          unoptimized
        />
        {banner.actionUrl && banner.actionLabel && (
          <Link href={banner.actionUrl}>
            <Button className="absolute right-4 bottom-4">
              {banner.actionLabel}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
