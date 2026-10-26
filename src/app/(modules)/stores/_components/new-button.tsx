"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DialogButton } from "~/components/dialog-button";
import { Button } from "~/components/ui/button";
import { StoreForm } from "./store-form";

export function NewButton() {
  const t = useTranslations("HomePage.stores.form");

  return (
    <DialogButton
      title={t("title")}
      description={t("description")}
      className="md:max-w-3xl"
      content={StoreForm}
      store={undefined}
    >
      <Button size="sm" className="h-7 px-2 text-xs">
        <PlusIcon />
        {t("title")}
      </Button>
    </DialogButton>
  );
}
