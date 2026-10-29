import { api } from "~/libs/trpc/server";

import { MenuSection, type MenuCategory } from "./menu-section";
import { FloaterCartButton } from "./floater-cart-button";
import { WhatsAppButton } from "./whats-app-button";
import { BannerList } from "./banner-list";

export default async function ProductList() {
  const products = await api.product.all();

  const categoriesWithProducts: Array<MenuCategory> = products?.reduce(
    (acc, product) => {
      const category = acc.find((c) => c.id === product.categoryId);
      if (category) {
        category.products.push(product);
      } else {
        acc.push({
          id: product.categoryId,
          title: product.categoryName ?? "Unknown Category",
          products: [product],
        });
      }
      return acc;
    },
    [] as Array<MenuCategory>,
  );

  return (
    <>
      <BannerList />
      {categoriesWithProducts.map((category) => (
        <MenuSection key={category.id} {...category} />
      ))}
      <div className="fixed right-6 bottom-6 z-40">
        <FloaterCartButton products={products ?? []}>
          <WhatsAppButton />
        </FloaterCartButton>
      </div>
    </>
  );
}
