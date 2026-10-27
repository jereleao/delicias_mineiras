"use client";

import { useTranslations } from "next-intl";
import type { Role } from "~/libs/api/routers/permissions";

type RoleCellProps = {
  roleIds: number[];
  options: Array<Role>;
};

export function RoleCell({ roleIds, options }: RoleCellProps) {
  const t = useTranslations("AdminPage.users");

  const selectedRoles = options.filter((role) => roleIds.includes(role.id));

  return (
    <span>
      {selectedRoles
        .map(({ name }) => t("roles", { opt: name }))
        .join(", ") || "—"}
    </span>
  );
}
