import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import type { BannerFormType } from "../../_actions/schema";
import { DialogButton } from "~/components/dialog-button";
import { BannerForm } from "../banner-form";

type EditButtonProps = {
  id: number;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
};

export function EditButton({
  id,
  title,
  description,
  imageUrl,
}: EditButtonProps) {
  const t = useTranslations("AdminPage.banners.table");

  const banner: BannerFormType = {
    id,
    title: title ?? "",
    description: description ?? null,
    imageUrl: imageUrl ?? "",
  };

  return (
    <Tooltip content={t("actions.edit.title")}>
      <DialogButton
        title={t("actions.edit.title")}
        description={t("actions.edit.description")}
        className="md:max-w-3xl"
        content={BannerForm}
        banner={banner}
      >
        <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
          <PencilIcon className="size-4" />
          <span className="sr-only">{t("actions.edit.title")}</span>
        </Button>
      </DialogButton>
    </Tooltip>
  );
}
