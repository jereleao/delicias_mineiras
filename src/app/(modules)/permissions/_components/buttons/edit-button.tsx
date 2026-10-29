import { useTranslations } from "next-intl";
import { PencilIcon } from "lucide-react";

import type { FullRole } from "~/libs/api/routers/permissions";
import { api } from "~/libs/trpc/react";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { DialogButton } from "~/components/dialog-button";

import { RoleForm } from "../role-form";

type EditButtonProps = FullRole;

export function EditButton({
  id,
  name,
  storeId,
  description,
  permissions,
}: EditButtonProps) {
  const t = useTranslations("PermissionsPage.roles.table");
  const utils = api.useUtils();

  const prefetchFormQueries = () => {
    void utils.permission.all.prefetch();
    void utils.store.all.prefetch();
  };

  const role = {
    id,
    name,
    storeId,
    description: description ?? "",
    permissions,
  };

  return (
    <Tooltip content={t("actions.edit.title")}>
      <DialogButton
        title={t("actions.edit.title")}
        description={t("actions.edit.description")}
        className="md:max-w-3xl"
        content={RoleForm}
        role={role}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="hover:bg-primary/10"
          onMouseEnter={prefetchFormQueries}
        >
          <PencilIcon className="size-4" />
          <span className="sr-only">{t("actions.edit.title")}</span>
        </Button>
      </DialogButton>
    </Tooltip>
  );
}
