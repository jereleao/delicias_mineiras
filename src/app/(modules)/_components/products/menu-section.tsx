import { ProductCard } from "./product-card";
import type { MenuCategory } from "./products";

type MenuSectionProps = MenuCategory;

export function MenuSection({ id, title, products }: MenuSectionProps) {
  return (
    <section aria-labelledby={id.toString()} className="scroll-mt-24">
      <div className="border-border mb-6 border-b pb-3">
        <h2
          id={id.toString()}
          className="font-display text-foreground flex items-center gap-3 text-2xl font-extrabold sm:text-3xl"
        >
          <span
            className="bg-primary h-7 w-1.5 rounded-full"
            aria-hidden="true"
          />
          {title}
        </h2>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
