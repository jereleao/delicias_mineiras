import React from "react";
import CustomLink from "./custom-link";
import Image from "next/image";
import { cn } from "~/utils";
import { api } from "~/libs/trpc/server";

interface LogoLinkHomeProps {
  className?: string;
  variant?: "default" | "small";
}

export async function LogoLinkHome({
  className,
  variant = "default",
}: LogoLinkHomeProps) {
  const config = await api.config.logoConfig();

  console.log("config", config);

  return (
    <CustomLink href="/" className={cn("flex items-center gap-1", className)}>
      <Image
        className="h-8 w-auto"
        src="/assets/shopping-cart.png"
        alt="Logo"
        width={100}
        height={56}
        priority
      />
    </CustomLink>
  );
}
