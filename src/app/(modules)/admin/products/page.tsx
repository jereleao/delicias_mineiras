import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table";
import { columns } from "./_components/columns";
import type { GetProductResponse } from "~/libs/api/routers/product";

export default async function AdminPage() {
  const products: GetProductResponse = await api.product.all();

  console.debug("TODO: make responsible design on columns widths");

  return (
    <>
      <DataTable columns={columns} data={products} />
    </>
  );
}
