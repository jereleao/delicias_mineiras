"use client";

import {
  BanIcon,
  CircleCheckBigIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Button, LoadingButton } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { NewProductButton } from "./new-product-button";
import type { Product } from "~/libs/api/routers/product";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { useTransition } from "react";
import { deleteAction } from "../_actions/delete-action";
import { inactivateAction } from "../_actions/inactivate-action";
import { activateAction } from "../_actions/activate-action";
import { cn } from "~/utils";
import { DialogButton } from "~/components/dialog-button";
import { ProductForm } from "./product-form";
import type {
  NewProductFormType,
  NewProductType,
} from "../_actions/new-product-schema";
import DeleteProductButton from "./buttons/delete-button";
import { EditProductButton } from "./buttons/edit-button";
import { ActivateProductButton } from "./buttons/activate-button";
import { InactivateProductButton } from "./buttons/inactivate-button";

const columnHelper = createColumnHelper<Product>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
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
        header: "max-w-12",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="flex justify-center"
        title={NewProductButton}
      />
    ),
    cell: ({ row }) => {
      const productId = row.original.id.toString();

      const isActive = row.original.active;

      return (
        <div>
          <EditProductButton {...row.original} />
          {isActive ? (
            <InactivateProductButton productId={productId} />
          ) : (
            <ActivateProductButton productId={productId} />
          )}
          <DeleteProductButton productId={productId} />
        </div>
      );
    },
  }),
]);
