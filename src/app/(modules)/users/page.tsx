import { api } from "~/libs/trpc/server";
import { UsersTable } from "./_components/users-table";
import type { TableConfiguration } from "~/components/table/data-table";
import { DEFAULT_TABLE_CONFIGURATION } from "~/components/table/data-table-whapper";

export default async function UsersPage() {
  const tableId = "users";

  const [data, roleOptions, dbConfig] = await Promise.all([
    api.user.allPlatform(),
    api.permission.platformRoles(),
    api.userObject.getByKey({
      key: `table_${tableId}`,
    }),
  ]);

  const tableConfig: TableConfiguration =
    (dbConfig?.value as TableConfiguration) ?? DEFAULT_TABLE_CONFIGURATION;

  return (
    <UsersTable
      data={data}
      roleOptions={roleOptions ?? []}
      config={tableConfig}
    />
  );
}
