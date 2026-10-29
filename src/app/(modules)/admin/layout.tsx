import { redirect } from "next/navigation";
import { getStoreForCurrentHost } from "~/libs/stores/server";
import { getPathByMenuKey } from "~/libs/auth/menus";
import { StoreScopeProvider } from "~/libs/stores/store-scope-context";

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const store = await getStoreForCurrentHost();

  if (!store) redirect(getPathByMenuKey("stores"));

  return <StoreScopeProvider storeId={store.id}>{children}</StoreScopeProvider>;
}
