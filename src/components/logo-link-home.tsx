import React from "react";
import CustomLink from "./custom-link";
import Image from "next/image";

export function LogoLinkHome() {
  return (
    <CustomLink href="/">
      <Image
        src="https://placehold.co/100x32"
        alt="Logo"
        width={100}
        height={32}
        unoptimized
      />
    </CustomLink>
  );
}
