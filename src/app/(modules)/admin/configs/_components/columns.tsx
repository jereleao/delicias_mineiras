"use client";

import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import type { Config } from "~/libs/api/routers/config";

import { ValueCell } from "./value-cell";
import { useTranslations } from "next-intl";

const columnHelper = createColumnHelper<Config>();

export const columns = columnHelper.columns([
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
