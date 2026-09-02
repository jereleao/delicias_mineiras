import { api } from "~/libs/trpc/server";
import ProductContent from "./_components/product-content";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const id = Number(productId);
  const product = await api.product.getById({ id });

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-4">
      <ProductContent product={product} />
    </main>
  );
}
