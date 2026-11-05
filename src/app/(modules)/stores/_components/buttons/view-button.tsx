import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { getStoreUrl } from "~/utils";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";

type ViewButtonProps = {
  slug: string;
};

export function ViewButton({ slug }: ViewButtonProps) {
  const t = useTranslations("HomePage.stores.table");
  const storeUrl = getStoreUrl(slug);

  return (
    <Tooltip content={t("actions.view")}>
      <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
        <Link
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <EyeIcon className="size-4" />
          <span className="sr-only">{t("actions.view")}</span>
        </Link>
      </Button>
    </Tooltip>
  );
}
