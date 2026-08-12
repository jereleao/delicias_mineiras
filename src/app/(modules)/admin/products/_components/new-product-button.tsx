"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DialogButton } from "~/components/dialog-button";
import { Button } from "~/components/ui/button";
import { ProductForm } from "./product-form";

export function NewProductButton() {
  const t = useTranslations("AdminPage");

  return (
    <DialogButton
      title={t("products.form.title")}
      description={t("products.form.description")}
      className="md:max-w-3xl"
      ContentComponent={ProductForm}
      product={undefined}
    >
      <Button size="sm" className="h-6 px-2 text-xs">
        <PlusIcon />
        {t("products.form.title")}
      </Button>
    </DialogButton>
  );
}
