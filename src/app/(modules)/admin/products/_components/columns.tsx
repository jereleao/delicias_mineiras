"use client";

import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Checkbox } from "~/components/ui/checkbox";
import type { Product } from "~/libs/api/routers/product";
import { cn } from "~/utils";

import { DeleteProductButton } from "./buttons/delete-button";
import { NewProductButton } from "./new-product-button";
import { EditProductButton } from "./buttons/edit-button";
import { ActivateProductButton } from "./buttons/activate-button";
import { InactivateProductButton } from "./buttons/inactivate-button";
import PermissionGuard from "~/components/permission-guard";

const columnHelper = createColumnHelper<Product>();

export const columns = columnHelper.columns([
  // columnHelper.display({
  //   id: "select",
  //   meta: {
  //     classNames: {
  //       header: "w-8",
  //     },
  //   },
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       indeterminate={
  //         table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // }),
  columnHelper.accessor("name", {
    meta: {
      classNames: {
        header: "w-36",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.name"
      />
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
  columnHelper.accessor("description", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.description"
        className="w-full"
      />
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
  columnHelper.accessor("categoryName", {
    meta: {
      classNames: {
        header: "w-32",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.categoryName"
      />
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
  columnHelper.accessor("price", {
    meta: {
      classNames: {
        header: "w-24",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.price"
        className="flex justify-end"
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      const isActive = row.original.active;

      return (
        <div
          className={cn(
            "pr-4 text-right font-medium",
            !isActive && "text-muted-foreground",
          )}
        >
          {formatted}
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="flex justify-center"
        title={
          <PermissionGuard permission="admin.products:manage">
            <NewProductButton />
          </PermissionGuard>
        }
      />
    ),
    cell: ({ row }) => {
      const productId = row.original.id.toString();

      const isActive = row.original.active;

      return (
        <div>
          <PermissionGuard permission="admin.products:edit">
            <EditProductButton {...row.original} />
            {isActive ? (
              <InactivateProductButton productId={productId} />
            ) : (
              <ActivateProductButton productId={productId} />
            )}
          </PermissionGuard>
          <PermissionGuard permission="admin.products:manage">
            <DeleteProductButton productId={productId} />
          </PermissionGuard>
        </div>
      );
    },
  }),
]);
