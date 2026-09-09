"use client";

import type { Product } from "~/libs/api/routers/product";
import { ProductForm } from "../../_components/product-form";
import { useRouter } from "next/navigation";
import type { ProductFormType } from "../../_actions/schema";

type ProductContentProps = {
  product: Product;
  modal?: boolean;
};

export default function ProductContent({
  product: { id, categoryId, name, description, price, imageUrl, keywords },
}: ProductContentProps) {
  const router = useRouter();

  const product: ProductFormType = {
    id,
    categoryId,
    name,
    description: description ?? null,
    price: Number(price),
    imageUrl: imageUrl ?? "",
    keywords: keywords ? keywords.split("|").map((word) => ({ word })) : null,
  };

  return (
    <div className="">
      <ProductForm
        product={product}
        setOpen={(open) => !open && router.back()}
      />
    </div>
  );
}
