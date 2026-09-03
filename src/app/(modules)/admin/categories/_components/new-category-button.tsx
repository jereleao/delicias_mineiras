"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DialogButton } from "~/components/dialog-button";
import { Button } from "~/components/ui/button";
import { CategoryForm } from "./category-form";

export function NewCategoryButton() {
  const t = useTranslations("AdminPage");

  return (
    <DialogButton
      title={t("categories.form.title")}
      description={t("categories.form.description")}
      className="md:max-w-3xl"
      ContentComponent={CategoryForm}
    >
      <Button size="sm" className="h-6 px-2 text-xs">
        <PlusIcon />
        {t("categories.form.title")}
      </Button>
    </DialogButton>
  );
}
