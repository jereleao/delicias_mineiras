"use client";

import { cn } from "~/utils";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import PermissionGuard from "~/components/permission-guard";
import type { Product } from "~/libs/api/routers/product";

import { NewButton } from "./new-button";
import { DeleteButton } from "./buttons/delete-button";
import { EditButton } from "./buttons/edit-button";
import { ActivateButton } from "./buttons/activate-button";
import { InactivateButton } from "./buttons/inactivate-button";
import { DataTableColumnOptions } from "~/components/table/data-table-column-options";
import { useTouchDevice } from "~/hooks/use-touch-devide";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { DialogButton } from "~/components/dialog-button";
import { Tooltip } from "~/components/ui/tooltip";

const columnHelper = createColumnHelper<Product>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    meta: {
      classNames: {
        header: "w-36",
      },
      tKey: "AdminPage.products.table.columns.name",
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
  columnHelper.accessor("description", {
    meta: {
      tKey: "AdminPage.products.table.columns.description",
    },
    enableHiding: true,
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
  columnHelper.accessor("imageUrl", {
    enableHiding: true,
    meta: {
      tKey: "AdminPage.products.table.columns.imageUrl",
    },
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ cell, row }) => {
      const isActive = row.original.active;
      const cellValue = cell.getValue();

      const isTouch = useTouchDevice();
      const t = useTranslations("AdminPage");

      const image = (
        <Image
          src={cellValue!}
          alt={row.original.description ?? "Product Image"}
          width={256}
          height={256}
          className="size-20 rounded-sm object-cover"
          unoptimized
        />
      );

      const icon = (
        <ImageIcon
          className={cn("size-4", !isActive && "text-muted-foreground")}
        />
      );

      if (isTouch)
        return (
          <DialogButton
            title={t("banners.form.title")}
            className="md:max-w-3xl"
            content={image}
          >
            {icon}
          </DialogButton>
        );

      return (
        <Tooltip className="px-1.5" content={image}>
          {icon}
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor("categoryName", {
    enableHiding: true,
    meta: {
      classNames: {
        header: "w-32",
      },
      tKey: "AdminPage.products.table.columns.categoryName",
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
  columnHelper.accessor("price", {
    meta: {
      classNames: {
        header: "w-24",
      },
      tKey: "AdminPage.products.table.columns.price",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="flex justify-end" />
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
    header: ({ table }) => (
      <DataTableColumnOptions
        table={table}
        title={
          <PermissionGuard permission="store.products:manage">
            <NewButton />
          </PermissionGuard>
        }
      />
    ),
    cell: ({ row }) => {
      const productId = row.original.id.toString();

      const isActive = row.original.active;

      return (
        <div>
          <PermissionGuard permission="store.products:edit">
            <EditButton {...row.original} />
            {isActive ? (
              <InactivateButton productId={productId} />
            ) : (
              <ActivateButton productId={productId} />
            )}
          </PermissionGuard>
          <PermissionGuard permission="store.products:manage">
            <DeleteButton productId={productId} />
          </PermissionGuard>
        </div>
      );
    },
  }),
]);
