import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table";
import { columns } from "./_components/columns";
import type { GetConfigResponse } from "~/libs/api/routers/config";

export default async function BannersPage() {
  const data: GetConfigResponse = await api.config.all();

  console.debug("TODO: make responsible design on columns widths");

  return <DataTable columns={columns} data={data} className="mt-4" />;
}
