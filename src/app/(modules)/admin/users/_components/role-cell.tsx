"use client";

import { useTranslations } from "next-intl";
import { useOptimistic, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { updateRoleAction } from "../_actions/update-role-action";
import { Tooltip } from "~/components/ui/tooltip";
import type { Role } from "~/libs/api/routers/permissions";

type RoleCellProps = {
  userId: string;
  roleId: number;
  options: Array<Role>;
};

export function RoleCell({ userId, roleId, options }: RoleCellProps) {
  const [optimisticRole, setOptimisticRole] = useOptimistic(roleId.toString());

  const [isSaving, startTransition] = useTransition();

  const handleChange = (newRoleId: string) => {
    startTransition(async () => {
      setOptimisticRole(newRoleId);

      updateRoleAction(userId, Number(newRoleId));
    });
  };

  const t = useTranslations("AdminPage.users");

  return (
    <Select
      value={optimisticRole}
      onValueChange={handleChange}
      disabled={isSaving}
    >
      <SelectTrigger className="h-8 min-w-28 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map(({ id, name, description }) =>
          description ? (
            <Tooltip key={`${id}-${name}`} content={description} side="right">
              <SelectItem value={id.toString()}>
                {t("roles", { opt: name })}
              </SelectItem>
            </Tooltip>
          ) : (
            <SelectItem value={id.toString()} key={`${id}-${name}`}>
              {t("roles", { opt: name })}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}
