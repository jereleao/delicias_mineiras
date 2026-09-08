"use client";

import Image from "next/image";
// import { PlusIcon, CheckIcon } from "lucide-react";
// import { useState } from "react";
import { formatPrice } from "./products";
import type { Product } from "~/libs/api/routers/product";

export function ProductCard({
  product,
  // onAdd,
}: {
  product: Product;
  // onAdd: (product: Product) => void;
}) {
  // const [added, setAdded] = useState(false);

  // function handleAdd() {
  //   // onAdd(product);
  //   setAdded(true);
  //   window.setTimeout(() => setAdded(false), 1000);
  // }

  return (
    <article className="group border-border bg-card flex gap-4 rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-card-foreground text-lg leading-tight font-bold text-pretty">
          {product.name}
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
          {product.description}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-4">
          <span className="font-display text-primary text-xl font-extrabold">
            {formatPrice(+product.price)}
          </span>
          {/* <button
            type="button"
            onClick={handleAdd}
            aria-label={`Adicionar ${product.name} ao pedido`}
            className="bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground focus-visible:ring-ring focus-visible:ring-offset-card ml-auto flex size-10 shrink-0 items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
          >
            {added ? (
              <CheckIcon className="size-5" />
            ) : (
              <PlusIcon className="size-5" />
            )}
          </button> */}
        </div>
      </div>

      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
        <Image
          src={product.imageUrl || "/assets/placeholder.png"}
          alt={product.name || "Imagem do produto"}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </article>
  );
}
