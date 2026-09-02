import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table";
import { columns } from "./_components/columns";
import type { GetCategoryResponse } from "~/libs/api/routers/category";

export default async function CategoriesPage() {
  const categories: GetCategoryResponse = await api.category.all();

  console.debug("TODO: make responsible design on columns widths");

  return (
    <>
      <DataTable columns={columns} data={categories} className="mt-4" />
    </>
  );
}
