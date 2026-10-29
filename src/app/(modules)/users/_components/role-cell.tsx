"use client";

import { Badge } from "~/components/ui/badge";
import type { RoleOption } from "~/libs/api/routers/permissions";

type RoleCellProps = {
  roleIds: number[];
  options: Array<RoleOption>;
};

export function RoleCell({ roleIds, options }: RoleCellProps) {
  const selectedRoles = options.filter((role) => roleIds.includes(role.id));

  console.log({ roleIds, options, selectedRoles });

  // eslint-disable-next-line react/jsx-no-literals
  if (!selectedRoles.length) return <span>—</span>;

  return (
    <div className="flex gap-1">
      {selectedRoles.map(({ id, key }) => {
        return <Badge key={id}>{key}</Badge>;
      })}
    </div>
  );
}
