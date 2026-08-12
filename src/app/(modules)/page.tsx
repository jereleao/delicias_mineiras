import { api } from "~/libs/trpc/server";

import { MenuSection } from "./_components/menu-section";
import { BannerList } from "./_components/banner-list";
import { type MenuCategory } from "./_components/products";

export default async function Home() {
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
    </>
  );
}
