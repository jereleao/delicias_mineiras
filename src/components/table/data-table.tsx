"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { api } from "~/libs/trpc/react";
import { cn } from "~/utils";

import { features, type DataTableFeatures } from "./data-table-features";
import { DataTablePagination } from "./data-table-pagination";

export interface TableConfiguration {
  sorting: SortingState;
  columnVisibility: ColumnVisibilityState;
}

interface DataTableProps<TData extends RowData> {
  id: string;
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  className?: string;
  config: TableConfiguration;
}

export function DataTableComponent<TData extends RowData>({
  id: tableId,
  columns,
  data,
  className,
  config,
}: DataTableProps<TData>) {
  const { mutate: saveConfig } = api.userObject.createOrUpdate.useMutation({
    onError: (error) => toast.error(error.message),
  });
  const [sorting, setSorting] = useState<SortingState>(config.sorting);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>(config.columnVisibility);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(nextSorting);
      saveConfig({
        key: `table_${tableId}`,
        value: { sorting: nextSorting, columnVisibility },
      });
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (updater) => {
      const nextColumnVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setColumnVisibility(nextColumnVisibility);
      saveConfig({
        key: `table_${tableId}`,
        value: { columnVisibility: nextColumnVisibility, sorting },
      });
    },
    onRowSelectionChange: setRowSelection,
    defaultColumn: {
      enableHiding: false,
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    meta: {
      id: tableId,
    },
  });

  const t = useTranslations("Common");

  return (
    <>
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div> */}
      <div className={cn("overflow-hidden", className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.columnDef.meta?.classNames?.header,
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.classNames?.cell,
                      )}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <DataTablePagination table={table} /> */}
    </>
  );
}
