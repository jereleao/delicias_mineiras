import React from "react";
import CustomLink from "./custom-link";
import Image from "next/image";
import { cn } from "~/utils";

interface LogoLinkHomeProps {
  className?: string;
  hideName?: boolean;
}

export function LogoLinkHome({ className, hideName }: LogoLinkHomeProps) {
  const logoName = "Delícias Mineiras";

  return (
    <CustomLink href="/" className={cn("flex items-center gap-1", className)}>
      <Image
        className="h-8 w-auto"
        src="/assets/delicias_logo.png"
        alt="Logo"
        width={100}
        height={56}
        priority
      />
      {!hideName && (
        <p className="bold text-secondary-foreground font-serif text-2xl">
          {logoName}
        </p>
      )}
    </CustomLink>
  );
}
