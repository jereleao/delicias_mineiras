"use client";

import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import PermissionGuard from "~/components/permission-guard";
import type { FullRole } from "~/libs/api/routers/permissions";

import { NewButton } from "./new-button";
import { EditButton } from "./buttons/edit-button";
import { DeleteButton } from "./buttons/delete-button";
import { DataTableColumnOptions } from "~/components/table/data-table-column-options";

const columnHelper = createColumnHelper<FullRole>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="PermissionsPage.roles.table.columns.name"
      />
    ),
    cell: ({ cell, row }) => {
      const roleName = cell.getValue();
      const storeSlug = row.original.storeSlug;

      return (
        <span>
          {storeSlug ? `${storeSlug}:` : ""}
          {roleName}
        </span>
      );
    },
  }),
  columnHelper.accessor("storeName", {
    enableHiding: true,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="PermissionsPage.roles.table.columns.storeName"
      />
    ),
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="PermissionsPage.roles.table.columns.description"
      />
    ),
    cell: ({ cell }) => <span>{cell.getValue() || ""}</span>,
  }),
  columnHelper.display({
    id: "actions",
    meta: {
      classNames: {
        cell: "flex justify-center py-1",
        header: "w-24",
      },
    },
    header: ({ table }) => (
      <DataTableColumnOptions
        table={table}
        title={
          <PermissionGuard permission="permissions:manage">
            <NewButton />
          </PermissionGuard>
        }
      />
    ),
    cell: ({ row }) => {
      const role = row.original;

      return (
        <div className="flex gap-1">
          <PermissionGuard permission="permissions:edit">
            <EditButton {...role} />
          </PermissionGuard>
          <PermissionGuard permission="permissions:manage">
            <DeleteButton roleId={role.id} />
          </PermissionGuard>
        </div>
      );
    },
  }),
]);
