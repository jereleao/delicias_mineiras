import type { Product } from "~/libs/api/routers/product";

type ProductContentProps = {
  product: Product;
  modal?: boolean;
};

export default function ProductContent({ product }: ProductContentProps) {
  return <div className="">{product.name}</div>;
}
