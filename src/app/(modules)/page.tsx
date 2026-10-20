import { auth } from "~/libs/auth";
import ProductList from "./_components/products/product-list";

import { hasStoreForCurrentHost } from "~/libs/stores/server";
import StoreList from "./_components/stores/store-list";

export default async function Home() {
  const hasStore = await hasStoreForCurrentHost();

  if (hasStore) return <ProductList />;

  const session = await auth();

  console.warn("TODO: Remove this check for admin access.");
  const hasAdminAccess = session != null;

  if (hasAdminAccess) return <StoreList />;

  console.warn(
    "TODO: Implement a marketing page for stores without a store configured.",
  );
  return <p>MARKETING</p>;
}
