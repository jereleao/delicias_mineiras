import { api } from "~/libs/trpc/server";
import { UsersTable } from "./_components/users-table";

export default async function UsersPage() {
  const [data, roleOptions] = await Promise.all([
    api.user.all(),
    api.permission.roles(),
  ]);

  return <UsersTable data={data} roleOptions={roleOptions ?? []} />;
}
