"use client";

import { useTransition } from "react";
import { deleteAction } from "../../_actions/delete-action";
import { Tooltip } from "~/components/ui/tooltip";
import { LoadingButton } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

type DeleteButtonProps = {
  roleId: number;
};

export function DeleteButton({ roleId }: DeleteButtonProps) {
  const t = useTranslations("PermissionsPage.roles.table");

  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => await deleteAction(roleId));

  return (
    <Tooltip content={t("actions.delete")}>
      <LoadingButton
        variant="ghost"
        size="icon-sm"
        className="hover:bg-destructive/10"
        isLoading={isPending}
        replace
        onClick={handleClick}
      >
        <Trash2Icon className="stroke-destructive size-4" />
        <span className="sr-only">{t("actions.delete")}</span>
      </LoadingButton>
    </Tooltip>
  );
}
