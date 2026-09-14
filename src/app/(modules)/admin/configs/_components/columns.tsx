"use client";

import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Checkbox } from "~/components/ui/checkbox";
import type { Config } from "~/libs/api/routers/config";

import { ValueCell } from "./value-cell";
import { useTranslations } from "next-intl";

const columnHelper = createColumnHelper<Config>();

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
  columnHelper.accessor("code", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.configs.table.columns.description"
        className="w-full"
      />
    ),
    cell: ({ cell }) => {
      const t = useTranslations("AdminPage.configs.table.values");

      type tKeys = Parameters<typeof t>[0];

      const configCode = cell.getValue() as tKeys;

      return t.has(configCode) ? t(configCode) : t("invalid");
    },
  }),
  columnHelper.accessor("value", {
    meta: {
      classNames: {
        header: "w-100",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.configs.table.columns.value"
      />
    ),
    cell: ({ cell, row }) => {
      const codeId = row.original.code;
      const cellValue = cell.getValue();

      return <ValueCell codeId={codeId} value={cellValue} />;
    },
  }),
]);
