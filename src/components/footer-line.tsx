/* eslint-disable react/jsx-no-literals */
import Link from "next/link";
import { env } from "~/env";
import CustomLink from "./custom-link";
import { getTranslations } from "next-intl/server";

export async function FooterLine() {
  const t = await getTranslations();

  const appVersion = `v${env.NEXT_PUBLIC_APP_VERSION}`;

  return (
    <div className="container mx-auto flex max-w-6xl justify-between gap-10 px-4 py-2 sm:px-6">
      <div className="text-muted-foreground flex gap-1 text-xs">
        <span>{appVersion}</span>
        <span>©</span>
        <Link
          href="https://www.craft.tec.br/"
          className="text-muted-foreground [&>svg]:size-3"
        >
          CRAFT
        </Link>
        <p>{t("Footer.rights")}</p>
      </div>
      <CustomLink
        href="https://www.craft.tec.br/"
        className="text-muted-foreground [&>svg]:size-3"
      >
        <p className="text-xs">{t("Footer.crafted")}</p>
      </CustomLink>
    </div>
  );
}
