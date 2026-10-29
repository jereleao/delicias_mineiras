import { getTranslations } from "next-intl/server";
import { env } from "~/env";
import CustomLink from "./custom-link";

export default async function Footer() {
  const t = await getTranslations();

  const appVersion = `v${env.NEXT_PUBLIC_APP_VERSION}`;

  return (
    <footer className="bg-muted w-dvw">
      <div className="container mx-auto flex max-w-6xl justify-between gap-10 px-4 py-2 sm:px-6">
        <p className="text-muted-foreground text-xs">
          {t("Footer.versionCraft", { appVersion })}
        </p>
        <CustomLink
          href="https://www.craft.tec.br/"
          className="text-muted-foreground [&>svg]:size-3"
        >
          <p className="text-xs">{t("Footer.crafted")}</p>
        </CustomLink>
      </div>
    </footer>
  );
}
