import type { Store } from "~/libs/api/routers/store";
import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table-whapper";

import { columns } from "./columns";

export default async function StoreList() {
  const data: Array<Store> = await api.store.all();

  return (
    <DataTable id="stores" columns={columns} data={data} className="mt-4" />
  );
}
