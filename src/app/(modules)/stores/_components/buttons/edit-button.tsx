import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import type { Store } from "~/libs/api/routers/store";
import Link from "next/link";

type EditButtonProps = {
  slug: Store["slug"];
};

export function EditButton({ slug }: EditButtonProps) {
  const t = useTranslations("HomePage.stores.table");

  return (
    <Tooltip content={t("actions.edit.title")}>
      <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
        <Link
          href={`/stores/${slug}`}
          className="flex items-center justify-center"
        >
          <PencilIcon className="size-4" />
          <span className="sr-only">{t("actions.edit.title")}</span>
        </Link>
      </Button>
    </Tooltip>
  );
}
