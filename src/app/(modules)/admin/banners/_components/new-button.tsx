"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DialogButton } from "~/components/dialog-button";
import { Button } from "~/components/ui/button";
import { BannerForm } from "./banner-form";

export function NewButton() {
  const t = useTranslations("AdminPage");

  return (
    <DialogButton
      title={t("banners.form.title")}
      description={t("banners.form.description")}
      className="md:max-w-3xl"
      content={BannerForm}
      banner={undefined}
    >
      <Button size="sm" className="h-6 px-2 text-xs">
        <PlusIcon />
        {t("banners.form.title")}
      </Button>
    </DialogButton>
  );
}
