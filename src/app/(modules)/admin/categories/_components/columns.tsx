"use client";

import { Trash2Icon, PencilIcon } from "lucide-react";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { NewCategoryButton } from "./new-category-button";
import type { Category } from "~/libs/api/routers/category";
import { cn } from "~/utils";
import { EditCategoryButton } from "./buttons/edit-button";
import { DeleteCategoryButton } from "./buttons/delete-button";

const columnHelper = createColumnHelper<Category>();

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
        header: "w-48",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.categories.table.columns.name"
      />
    ),
    cell: ({ cell }) => {
      const cellValue = cell.getValue();

      return <span>{cellValue}</span>;
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
        title={NewCategoryButton}
      />
    ),
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex gap-1">
          <EditCategoryButton {...category} />
          <DeleteCategoryButton categoryId={category.id} />
        </div>
      );
    },
  }),
]);
