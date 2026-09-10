import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";
import { DialogButton } from "~/components/dialog-button";
import { UserForm } from "../user-form";
import type { UserFormType } from "../../_actions/user-schema";
import type { Role } from "~/libs/api/routers/permissions";

type EditButtonProps = {
  id: string;
  name: string | null;
  bio: string | null;
  roleId: number;
  roleOptions: Array<Role>;
};

export function EditButton({
  id,
  name,
  bio,
  roleId,
  roleOptions,
}: EditButtonProps) {
  const t = useTranslations("AdminPage.users.table");

  const user: UserFormType = {
    id,
    name: name ?? "",
    bio: bio ?? undefined,
    roleId,
  };

  return (
    <Tooltip content={t("actions.edit.title")}>
      <DialogButton
        title={t("actions.edit.title")}
        description={t("actions.edit.description")}
        className="md:max-w-3xl"
        content={UserForm}
        user={user}
        roleOptions={roleOptions}
      >
        <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
          <PencilIcon className="size-4" />
          <span className="sr-only">{t("actions.edit.title")}</span>
        </Button>
      </DialogButton>
    </Tooltip>
  );
}
