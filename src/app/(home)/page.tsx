import { auth } from "~/libs/auth";
import ProductList from "./_components/product-list";

import { hasStoreForCurrentHost } from "~/libs/stores/server";
import { redirect } from "next/navigation";
import { getPathByMenuKey, isAllowed } from "~/libs/auth/menus";

export default async function Home() {
  const hasStore = await hasStoreForCurrentHost();

  if (hasStore) return <ProductList />;

  const session = await auth();

  const hasStoresAccess = isAllowed(
    "stores",
    session?.user.permissions.platform ?? [],
  );

  if (hasStoresAccess) return redirect(getPathByMenuKey("stores"));

  console.warn(
    "TODO: Implement a marketing page for stores without a store configured.",
  );

  return <p>MARKETING</p>;
}
