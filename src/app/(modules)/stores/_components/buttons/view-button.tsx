import Link from "next/link";
import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { EyeIcon } from "lucide-react";
import { env } from "~/env";

type ViewButtonProps = {
  slug: string;
};

export function ViewButton({ slug }: ViewButtonProps) {
  const t = useTranslations("HomePage.stores.table");
  const storeUrl = new URL(env.NEXT_PUBLIC_BASE_URL);
  const baseHostname =
    storeUrl.hostname === "localhost" ? "localtest.me" : storeUrl.hostname;

  storeUrl.hostname = `${slug}.${baseHostname}`;

  return (
    <Tooltip content={t("actions.view")}>
      <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
        <Link href={storeUrl} className="flex items-center justify-center">
          <EyeIcon className="size-4" />
          <span className="sr-only">{t("actions.view")}</span>
        </Link>
      </Button>
    </Tooltip>
  );
}
