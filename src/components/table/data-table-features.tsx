import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper as createColumnHelperTS,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  type RowData,
} from "@tanstack/react-table";

// New in v9: declare the features this table uses — anything you don't
// register is tree-shaken out of the bundle.
export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  tableMeta: metaHelper<TableMeta>(),
  columnMeta: metaHelper<ColumnMeta>(),
});

export function createColumnHelper<TData extends RowData>() {
  return createColumnHelperTS<DataTableFeatures, TData>();
}

// Pass this as the first generic argument to `ColumnDef`, `Column`, `Table`,
// and `Row` so each type knows which feature APIs are available.
export type DataTableFeatures = typeof features;

interface TableMeta {
  classNames?: {
    table?: string;
    body?: string;
    row?: string;
  };
  // updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

interface ColumnMeta {
  classNames?: {
    header?: string;
    cell?: string;
  };
  // filterVariant?: "text" | "range" | "select";
}
