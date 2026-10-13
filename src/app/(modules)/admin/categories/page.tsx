import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table-whapper";
import { columns } from "./_components/columns";
import type { GetCategoryResponse } from "~/libs/api/routers/category";

export default async function CategoriesPage() {
  const data: GetCategoryResponse = await api.category.all();

  console.debug("TODO: make responsible design on columns widths");

  return (
    <DataTable id="categories" columns={columns} data={data} className="mt-4" />
  );
}
