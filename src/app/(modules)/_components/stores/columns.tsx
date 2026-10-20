"use client";

import { cn } from "~/utils";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Checkbox } from "~/components/ui/checkbox";
import PermissionGuard from "~/components/permission-guard";
import type { Store } from "~/libs/api/routers/store";

import { NewButton } from "./new-button";
import { DeleteButton } from "./buttons/delete-button";
import { EditButton } from "./buttons/edit-button";
import { ActivateButton } from "./buttons/activate-button";
import { InactivateButton } from "./buttons/inactivate-button";
import { DataTableColumnOptions } from "~/components/table/data-table-column-options";
import CustomLink from "~/components/custom-link";

const columnHelper = createColumnHelper<Store>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    meta: {
      classNames: {
        header: "w-8",
      },
    },
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("name", {
    meta: {
      classNames: {
        header: "w-36",
      },
      tKey: "HomePage.stores.table.columns.name",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ cell, row }) => {
      const isActive = row.original.active;
      const cellValue = cell.getValue();
      return (
        <span className={cn(!isActive && "text-muted-foreground")}>
          {cellValue}
        </span>
      );
    },
  }),
  columnHelper.accessor("slug", {
    enableHiding: true,
    meta: {
      tKey: "HomePage.stores.table.columns.slug",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="w-full" />
    ),
    cell: ({ cell, row }) => {
      const isActive = row.original.active;
      const cellValue = cell.getValue();
      return (
        <span className={cn(!isActive && "text-muted-foreground")}>
          {cellValue}
        </span>
      );
    },
  }),
  columnHelper.accessor("domains", {
    enableHiding: true,
    meta: {
      tKey: "HomePage.stores.table.columns.domains",
    },
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ cell, row }) => {
      const isActive = row.original.active;
      const cellValue = cell.getValue();

      if (!isActive)
        return (
          <span className={cn(!isActive && "text-muted-foreground")}>
            {cellValue.join(", ")}
          </span>
        );

      return (
        <div>
          {cellValue.map((domain, index) => (
            <span key={index} className="mr-1 inline-block">
              <CustomLink href={`http://${domain}`}>{domain}</CustomLink>
            </span>
          ))}
        </div>
      );
    },
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
          <PermissionGuard permission="stores:manage">
            <NewButton />
          </PermissionGuard>
        }
      />
    ),
    cell: ({ row }) => {
      const storeId = row.original.id.toString();
      const isActive = row.original.active;
      return (
        <div>
          <PermissionGuard permission="stores:edit">
            <EditButton {...row.original} />
            {isActive ? (
              <InactivateButton storeId={storeId} />
            ) : (
              <ActivateButton storeId={storeId} />
            )}
          </PermissionGuard>
          <PermissionGuard permission="stores:manage">
            <DeleteButton storeId={storeId} />
          </PermissionGuard>
        </div>
      );
    },
  }),
]);
