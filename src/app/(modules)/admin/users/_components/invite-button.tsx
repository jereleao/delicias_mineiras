"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DialogButton } from "~/components/dialog-button";
import { Button } from "~/components/ui/button";
import { InviteForm } from "./invite-form";
import type { Role } from "~/libs/api/routers/permissions";

type InviteNewUserProps = {
  roleOptions: Array<Role>;
};

export function InviteNewUser(p: InviteNewUserProps) {
  const t = useTranslations("AdminPage");

  return (
    <DialogButton
      title={t("users.form.title")}
      description={t("users.form.description")}
      className="md:max-w-3xl"
      content={InviteForm}
      {...p}
    >
      <Button size="sm" className="h-6 px-2 text-xs">
        <PlusIcon />
        {t("users.form.title")}
      </Button>
    </DialogButton>
  );
}
