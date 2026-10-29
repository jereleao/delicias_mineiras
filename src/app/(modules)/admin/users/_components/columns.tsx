"use client";

import { CircleCheckIcon } from "lucide-react";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Tooltip } from "~/components/ui/tooltip";
import type { User } from "~/libs/api/routers/user";
import type { RoleOption } from "~/libs/api/routers/permissions";

import { EditButton } from "./buttons/edit-button";
import { DeleteButton } from "./buttons/delete-button";
import UserAvatar from "~/components/user-avatar";
import { InviteNewUser } from "./invite-button";
import { DataTableColumnOptions } from "~/components/table/data-table-column-options";
import { RoleCell } from "~/app/(modules)/users/_components/role-cell";

const columnHelper = createColumnHelper<User>();

export const getColums = (roleOptions: Array<RoleOption>) => {
  const columns = columnHelper.columns([
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
      enableHiding: true,
      meta: {
        tKey: "AdminPage.users.table.columns.bio",
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} className="w-full" />
      ),
    }),
    columnHelper.accessor("email", {
      enableHiding: true,
      meta: {
        tKey: "AdminPage.users.table.columns.email",
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
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
    columnHelper.accessor("roleIds", {
      enableHiding: true,
      meta: {
        classNames: {
          header: "w-36",
          cell: "py-0",
        },
        tKey: "AdminPage.users.table.columns.role",
      },
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ cell }) => {
        return <RoleCell roleIds={cell.getValue()} options={roleOptions} />;
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
