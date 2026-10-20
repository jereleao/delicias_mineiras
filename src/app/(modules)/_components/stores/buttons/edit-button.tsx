import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import { DialogButton } from "~/components/dialog-button";
import { StoreForm } from "../store-form";
import type { Store } from "~/libs/api/routers/store";

type EditButtonProps = {
  id: number;
  name: string | null;
  slug: string | null;
  domains: string[] | null;
};

export function EditButton({ id, name, slug, domains }: EditButtonProps) {
  const t = useTranslations("HomePage.stores.table");

  const store: Omit<Store, "active"> = {
    id,
    name: name ?? "",
    slug: slug ?? "null",
    domains: domains ?? [],
  };

  return (
    <Tooltip content={t("actions.edit.title")}>
      <DialogButton
        title={t("actions.edit.title")}
        description={t("actions.edit.description")}
        className="md:max-w-3xl"
        content={StoreForm}
        store={store}
      >
        <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
          <PencilIcon className="size-4" />
          <span className="sr-only">{t("actions.edit.title")}</span>
        </Button>
      </DialogButton>
    </Tooltip>
  );
}
