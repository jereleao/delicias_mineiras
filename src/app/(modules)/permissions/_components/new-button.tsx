"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DialogButton } from "~/components/dialog-button";
import { Button } from "~/components/ui/button";
import { RoleForm } from "./role-form";

export function NewButton() {
  const t = useTranslations("PermissionsPage.roles");

  return (
    <DialogButton
      title={t("form.title")}
      description={t("form.description")}
      className="md:max-w-3xl"
      content={RoleForm}
    >
      <Button size="sm" className="h-7 px-2 text-xs">
        <PlusIcon />
        {t("form.title")}
      </Button>
    </DialogButton>
  );
}
