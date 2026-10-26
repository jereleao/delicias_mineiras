import { auth } from "~/libs/auth";
import ProductList from "./_components/products/product-list";

import { hasStoreForCurrentHost } from "~/libs/stores/server";
import { redirect } from "next/navigation";
import { getPathByMenuKey } from "~/libs/auth/menus";

export default async function Home() {
  const hasStore = await hasStoreForCurrentHost();

  if (hasStore) return <ProductList />;

  const session = await auth();

  console.log("session", session);

  console.warn("TODO: Remove this check for admin access.");
  const hasAdminAccess = session != null;

  if (hasAdminAccess) return redirect(getPathByMenuKey("stores"));

  console.warn(
    "TODO: Implement a marketing page for stores without a store configured.",
  );
  return <p>MARKETING</p>;
}
