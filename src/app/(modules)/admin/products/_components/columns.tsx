"use client";

import { BanIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { createColumnHelper } from "~/components/table/data-table-features";
import { Button, LoadingButton } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { NewProductButton } from "./new-product-button";
import type { Product } from "~/libs/api/routers/product";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Tooltip } from "~/components/ui/tooltip";
import { useActionState, useTransition } from "react";
import { deleteAction } from "../_actions/delete-action";
import { inactivateAction } from "../_actions/inactivate-action";

const columnHelper = createColumnHelper<Product>();

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
        header: "w-36",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.name"
      />
    ),
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.description"
        className="w-full"
      />
    ),
  }),
  columnHelper.accessor("categoryName", {
    meta: {
      classNames: {
        header: "w-32",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.categoryName"
      />
    ),
  }),
  columnHelper.accessor("price", {
    meta: {
      classNames: {
        header: "w-24",
      },
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        tKey="AdminPage.products.table.columns.price"
        className="flex justify-end"
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="pr-4 text-right font-medium">{formatted}</div>;
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
        title={NewProductButton}
      />
    ),
    cell: ({ row }) => {
      const productId = row.original.id.toString();

      return (
        <div>
          <ViewProductButton productId={productId} />
          <InactivateProductButton productId={productId} />
          <DeleteProductButton productId={productId} />
        </div>
      );
    },
  }),
]);

type ViewProductButtonProps = {
  productId: number | string;
};

function ViewProductButton({ productId }: ViewProductButtonProps) {
  const t = useTranslations("AdminPage.products.table");
  return (
    <Tooltip content={t("actions.view")}>
      <Link href={`/admin/products/${productId}`}>
        <Button variant="ghost" size="icon-sm" className="hover:bg-primary/10">
          <EyeIcon className="size-4" />
          <span className="sr-only">{t("actions.view")}</span>
        </Button>
      </Link>
    </Tooltip>
  );
}

type DeleteProductButtonProps = {
  productId: number | string;
};

function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const t = useTranslations("AdminPage.products.table");
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => await deleteAction(productId));

  return (
    <Tooltip content={t("actions.delete")}>
      <LoadingButton
        variant="ghost"
        size="icon-sm"
        className="hover:bg-primary/10"
        isLoading={isPending}
        replace
        onClick={handleClick}
      >
        <Trash2Icon className="stroke-destructive size-4" />
        <span className="sr-only">{t("actions.delete")}</span>
      </LoadingButton>
    </Tooltip>
  );
}

type InactivateProductButtonProps = {
  productId: number | string;
};

function InactivateProductButton({ productId }: InactivateProductButtonProps) {
  const t = useTranslations("AdminPage.products.table");
  const [isPending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(async () => await inactivateAction(productId));

  return (
    <Tooltip content={t("actions.inactivate")}>
      <LoadingButton
        variant="ghost"
        size="icon-sm"
        className="hover:bg-primary/10"
        isLoading={isPending}
        replace
        onClick={handleClick}
      >
        <BanIcon className="size-4" />
        <span className="sr-only">{t("actions.inactivate")}</span>
      </LoadingButton>
    </Tooltip>
  );
}
