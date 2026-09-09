import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table";
import { columns } from "./_components/columns";
import type { GetBannerResponse } from "~/libs/api/routers/banner";

export default async function BannersPage() {
  const data: GetBannerResponse = await api.banner.all();

  console.debug("TODO: make responsible design on columns widths");

  return <DataTable columns={columns} data={data} className="mt-4" />;
}
