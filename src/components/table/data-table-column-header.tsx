import { type Column, type RowData } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
} from "lucide-react";

import { cn } from "~/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { type DataTableFeatures } from "./data-table-features";
import { useTranslations } from "next-intl";

interface BaseDataTableColumnHeaderProps<
  TData extends RowData,
  TValue,
> extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  column: Column<DataTableFeatures, TData, TValue>;
}

type MessageKey = Parameters<ReturnType<typeof useTranslations<never>>>[0];

interface DataTableColumnHeaderTranlationKey<
  TData extends RowData,
  TValue,
> extends BaseDataTableColumnHeaderProps<TData, TValue> {
  tKey: MessageKey;
}

interface DataTableColumnHeaderTitle<
  TData extends RowData,
  TValue,
> extends BaseDataTableColumnHeaderProps<TData, TValue> {
  title?:
    | React.ComponentType<{ column?: Column<DataTableFeatures, TData, TValue> }>
    | React.ReactNode;
}

type DataTableColumnHeaderProps<TData extends RowData, TValue> =
  | DataTableColumnHeaderTranlationKey<TData, TValue>
  | DataTableColumnHeaderTitle<TData, TValue>;

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  className,
  ...otherProps
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations();

  const resolvedTitle =
    "tKey" in otherProps ? (
      t(otherProps.tKey)
    ) : typeof otherProps.title == "function" ? (
      <otherProps.title column={column} />
    ) : (
      (otherProps.title ?? "")
    );

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{resolvedTitle}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{resolvedTitle}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon />
            ) : (
              <ChevronsUpDownIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon />
            {t("Common.tables.asc")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon />
            {t("Common.tables.desc")}
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOffIcon />
                {t("Common.tables.hide")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
