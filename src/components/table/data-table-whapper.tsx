import { type ColumnDef, type RowData } from "@tanstack/react-table";

import { type DataTableFeatures } from "~/components/table/data-table-features";
import { api } from "~/libs/trpc/server";
import {
  DataTableComponent,
  type TableConfiguration,
} from "~/components/table/data-table";

const DEFAULT_TABLE_CONFIGURATION: TableConfiguration = {
  sorting: [],
  columnVisibility: {},
};

interface DataTableWrapperProps<TData extends RowData> {
  id: string;
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  className?: string;
}

export async function DataTable<TData extends RowData>({
  id: tableId,
  ...props
}: DataTableWrapperProps<TData>) {
  const dbConfig = await api.userObject.getByKey({
    key: `table_${tableId}`,
  });

  const tableConfig: TableConfiguration =
    (dbConfig?.value as TableConfiguration) ?? DEFAULT_TABLE_CONFIGURATION;

  return <DataTableComponent id={tableId} config={tableConfig} {...props} />;
}
