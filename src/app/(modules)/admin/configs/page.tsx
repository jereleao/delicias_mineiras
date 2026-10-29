import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table-whapper";
import { columns } from "./_components/columns";
import type { GetConfigResponse } from "~/libs/api/routers/config";

export default async function ConfigsPage() {
  const data: GetConfigResponse = await api.config.all();

  console.debug("TODO: make responsible design on columns widths");

  return <DataTable id="configs" columns={columns} data={data} />;
}
