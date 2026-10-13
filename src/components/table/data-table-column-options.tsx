import { type RowData, type Table } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import { cn } from "~/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { type DataTableFeatures } from "./data-table-features";
import { useTranslations } from "next-intl";

interface BaseDataTableColumnOptionsProps<TData extends RowData> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  table: Table<DataTableFeatures, TData>;
  trigger?: React.ReactNode;
}

type MessageKey = Parameters<ReturnType<typeof useTranslations<never>>>[0];

interface DataTableColumnOptionsTranlationKey<
  TData extends RowData,
> extends BaseDataTableColumnOptionsProps<TData> {
  tKey: MessageKey;
}

interface DataTableColumnOptionsTitle<
  TData extends RowData,
> extends BaseDataTableColumnOptionsProps<TData> {
  title?:
    | React.ComponentType<{ table?: Table<DataTableFeatures, TData> }>
    | React.ReactNode;
}

type DataTableColumnOptionsProps<TData extends RowData> =
  | DataTableColumnOptionsTranlationKey<TData>
  | DataTableColumnOptionsTitle<TData>;

export function DataTableColumnOptions<TData extends RowData>({
  table,
  trigger,
  className,
  ...otherProps
}: DataTableColumnOptionsProps<TData>) {
  const t = useTranslations();

  const tranlatedPropTitle =
    "tKey" in otherProps && otherProps.tKey ? t(otherProps.tKey) : undefined;

  const resolvedTitle =
    "title" in otherProps ? (
      typeof otherProps.title == "function" ? (
        <otherProps.title table={table} />
      ) : (
        (otherProps.title ?? "")
      )
    ) : undefined;

  const title = resolvedTitle ?? tranlatedPropTitle ?? "";

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {title}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger ?? (
            <Button
              variant="outline"
              size="sm"
              className="ml-0 hidden h-7 lg:flex"
            >
              <MoreHorizontalIcon className="size-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuLabel>
            {t("Common.tables.toggleColumns")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => {
              const translatedMetaTitle = column.columnDef.meta?.tKey
                ? t(column.columnDef.meta.tKey)
                : undefined;

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {translatedMetaTitle ?? column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
