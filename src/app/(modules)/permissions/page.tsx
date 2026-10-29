import { api } from "~/libs/trpc/server";
import { DataTable } from "~/components/table/data-table-whapper";
import { columns } from "./_components/columns";

export default async function RolesPage() {
  const data = await api.permission.allRoles();

  return <DataTable id="roles" columns={columns} data={data} />;
}
