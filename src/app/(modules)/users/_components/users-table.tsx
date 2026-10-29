"use client";

import type { RoleOption } from "~/libs/api/routers/permissions";
import type { User } from "~/libs/api/routers/user";
import { getColums } from "./columns";
import {
  DataTableComponent,
  type TableConfiguration,
} from "~/components/table/data-table";

type UsersTableProps = {
  data: Array<User>;
  roleOptions: Array<RoleOption>;
  config: TableConfiguration;
};

export function UsersTable({ data, roleOptions, config }: UsersTableProps) {
  const columns = getColums(roleOptions);

  return (
    <DataTableComponent
      id="users"
      config={config}
      columns={columns}
      data={data}
    />
  );
}
