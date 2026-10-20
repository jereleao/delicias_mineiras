import type { Product } from "~/libs/api/routers/product";

export type MenuCategory = {
  id: number;
  title: string;
  products: Product[];
};

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
