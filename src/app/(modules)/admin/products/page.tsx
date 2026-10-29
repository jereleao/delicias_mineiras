import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table-whapper";
import { columns } from "./_components/columns";
import type { GetProductResponse } from "~/libs/api/routers/product";

export default async function ProductsPage() {
  const data: GetProductResponse = await api.product.all();

  console.debug("TODO: make responsible design on columns widths");

  return <DataTable id="products" columns={columns} data={data} />;
}
