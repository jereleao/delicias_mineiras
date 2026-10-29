import type { Store } from "~/libs/api/routers/store";
import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table-whapper";

import { columns } from "./_components/columns";

export default async function StoresPage() {
  const data: Array<Store> = await api.store.all();

  return <DataTable id="stores" columns={columns} data={data} />;
}
