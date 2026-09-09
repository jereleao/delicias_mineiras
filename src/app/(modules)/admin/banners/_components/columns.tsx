"use client";

import { cn } from "~/utils";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Checkbox } from "~/components/ui/checkbox";
import PermissionGuard from "~/components/permission-guard";
import type { Banner } from "~/libs/api/routers/banner";

import { NewButton } from "./new-button";
import { DeleteButton } from "./buttons/delete-button";
import { EditButton } from "./buttons/edit-button";
import { ActivateButton } from "./buttons/activate-button";
import { InactivateButton } from "./buttons/inactivate-button";
import Image from "next/image";
import { Tooltip } from "~/components/ui/tooltip";
import { ImageIcon } from "lucide-react";
import { useTouchDevice } from "~/hooks/use-touch-devide";
import { DialogButton } from "~/components/dialog-button";
import { useTranslations } from "next-intl";

const columnHelper = createColumnHelper<Banner>();

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
  columnHelper.accessor("title", {
    meta: {
      classNames: {
        header: "w-36",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.banners.table.columns.title"
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
        tKey="AdminPage.banners.table.columns.description"
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
  columnHelper.accessor("imageUrl", {
    // meta: {
    //   classNames: {
    //     header: "w-32",
    //   },
    // },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.banners.table.columns.imageUrl"
      />
    ),
    cell: ({ cell, row }) => {
      const isActive = row.original.active;
      const cellValue = cell.getValue();

      const isTouch = useTouchDevice();
      const t = useTranslations("AdminPage");

      const image = (
        <Image
          src={cellValue!}
          alt={row.original.description ?? "Banner Image"}
          width={1024}
          height={256}
          className="h-20 w-full rounded-sm object-cover"
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
          <PermissionGuard permission="admin.banners:manage">
            <NewButton />
          </PermissionGuard>
        }
      />
    ),
    cell: ({ row }) => {
      const bannerId = row.original.id.toString();
      const isActive = row.original.active;
      return (
        <div>
          <PermissionGuard permission="admin.banners:edit">
            <EditButton {...row.original} />
            {isActive ? (
              <InactivateButton bannerId={bannerId} />
            ) : (
              <ActivateButton bannerId={bannerId} />
            )}
          </PermissionGuard>
          <PermissionGuard permission="admin.banners:manage">
            <DeleteButton bannerId={bannerId} />
          </PermissionGuard>
        </div>
      );
    },
  }),
]);
