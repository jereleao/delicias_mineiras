import React from "react";
import CustomLink from "./custom-link";
import Image from "next/image";
import { cn } from "~/utils";
import { api } from "~/libs/trpc/server";

interface LogoLinkHomeProps {
  className?: string;
  variant?: "default" | "small";
}

const defaultLogoSrc = "/assets/shopping-cart.png";

export async function LogoLinkHome({
  className,
  variant = "default",
}: LogoLinkHomeProps) {
  const storeConfig = await api.config.storeConfig();

  const { logoFullLight, logoFullDark, logoSmallLight, logoSmallDark } =
    storeConfig || {};

  const variantLightSrc =
    variant === "small"
      ? logoSmallLight ||
        logoFullLight ||
        logoSmallDark ||
        logoFullDark ||
        defaultLogoSrc
      : logoFullLight ||
        logoSmallLight ||
        logoFullDark ||
        logoSmallDark ||
        defaultLogoSrc;

  const variantDarkSrc =
    variant === "small"
      ? logoSmallDark ||
        logoFullDark ||
        logoSmallLight ||
        logoFullLight ||
        defaultLogoSrc
      : logoFullDark ||
        logoSmallDark ||
        logoFullLight ||
        logoSmallLight ||
        defaultLogoSrc;

  return (
    <>
      <Logo
        className={cn("hidden dark:flex", className)}
        imageSrc={variantDarkSrc}
      />
      <Logo
        className={cn("flex dark:hidden", className)}
        imageSrc={variantLightSrc}
      />
    </>
  );
}

type LogoProps = Pick<LogoLinkHomeProps, "className"> & { imageSrc: string };

function Logo({ className, imageSrc }: LogoProps) {
  return (
    <CustomLink href="/" className={cn("items-center gap-1", className)}>
      <Image
        className="h-8 w-auto"
        src={imageSrc}
        alt="Logo"
        width={100}
        height={56}
        priority
      />
    </CustomLink>
  );
}
