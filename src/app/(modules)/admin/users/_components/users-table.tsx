"use client";

import { DataTable } from "~/components/table/data-table";
import type { Role } from "~/libs/api/routers/permissions";
import type { User } from "~/libs/api/routers/user";
import { getColums } from "./columns";

type UsersTableProps = {
  data: User[];
  roleOptions: Role[];
};

export function UsersTable({ data, roleOptions }: UsersTableProps) {
  const columns = getColums(roleOptions);

  return <DataTable columns={columns} data={data} className="mt-4" />;
}
