"use client";

import { CircleCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Checkbox } from "~/components/ui/checkbox";
import { Tooltip } from "~/components/ui/tooltip";
import type { User } from "~/libs/api/routers/user";
import { RoleCell } from "./role-cell";
import type { Role } from "~/libs/api/routers/permissions";

import { EditButton } from "./buttons/edit-button";
import { DeleteButton } from "./buttons/delete-button";
import UserAvatar from "~/components/user-avatar";
import { InviteNewUser } from "./invite-button";

const columnHelper = createColumnHelper<User>();

export const getColums = (roleOptions: Array<Role>) => {
  const columns = columnHelper.columns([
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
    columnHelper.accessor("image", {
      meta: {
        classNames: {
          header: "w-11",
          cell: "flex justify-end",
        },
      },
      header: () => null,
      cell: ({ row }) => (
        <UserAvatar
          image={row.original.image}
          name={row.original.name}
          className="size-5"
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          tKey="AdminPage.users.table.columns.name"
        />
      ),
    }),
    columnHelper.accessor("bio", {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          tKey="AdminPage.users.table.columns.bio"
          className="w-full"
        />
      ),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          tKey="AdminPage.users.table.columns.email"
        />
      ),
      cell: ({ cell, row }) => {
        const isVerified = row.original.emailVerified;
        const cellValue = cell.getValue();
        return (
          <div className="flex items-center gap-1">
            {cellValue}

            {isVerified && (
              <Tooltip content="Email verified">
                <CircleCheckIcon className="size-4 text-green-500" />
              </Tooltip>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("roleId", {
      meta: {
        classNames: {
          header: "w-36",
          cell: "py-0",
        },
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          tKey="AdminPage.users.table.columns.role"
        />
      ),
      cell: ({ cell, row }) => {
        const userId = row.original.id;
        const cellValue = cell.getValue();

        const t = useTranslations("Common");

        if (typeof cellValue !== "number") {
          return <span className="text-red-500">{t("invalid")}</span>;
        }

        return (
          <RoleCell userId={userId} roleId={cellValue} options={roleOptions} />
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
          title={<InviteNewUser roleOptions={roleOptions} />}
        />
      ),
      cell: ({ row }) => {
        const userId = row.original.id;
        return (
          <div>
            <EditButton {...row.original} roleOptions={roleOptions} />
            {/* 
            {isActive ? (
              <InactivateUserButton productId={productId} />
              ) : (
              <ActivateUserButton productId={productId} />
            )}
            */}
            <DeleteButton userId={userId} />
          </div>
        );
      },
    }),
  ]);

  return columns;
};
