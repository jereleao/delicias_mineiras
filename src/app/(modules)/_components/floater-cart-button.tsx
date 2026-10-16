"use client";

import { useMemo } from "react";
import { PencilIcon, ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Drawer, DrawerTrigger } from "~/components/ui/drawer";
import type { Product } from "~/libs/api/routers/product";

import { useCart } from "../_contexts/cart-context";
import { FloaterCart } from "./floater-cart";
import { WhatsAppShortcut } from "./whats-app-shortcut";

interface FloaterCartButtonProps extends React.PropsWithChildren {
  products: Array<Product>;
}

export function FloaterCartButton({
  products,
  children,
}: FloaterCartButtonProps) {
  const t = useTranslations("HomePage.cart");
  const { cart } = useCart();

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const productList = cart.products
    .map((item) => {
      const product = productById.get(item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((p) => p !== null) as Array<Product & { quantity: number }>;

  const itemCount = productList.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (itemCount === 0) {
    return children;
  }

  return (
    <Drawer direction="right">
      <div className="animate-in fade-in slide-in-from-rigth-8 bg-popover text-popover-foreground z-40 flex items-center gap-2 rounded-full border p-1.5 shadow-xl duration-500 sm:right-6 sm:bottom-6">
        <WhatsAppShortcut productList={productList} />
        <span className="flex items-center gap-2 px-1 text-sm font-semibold">
          <ShoppingBagIcon className="size-4" />
          {t("itemCount", { count: itemCount })}
        </span>
        <DrawerTrigger asChild>
          <Button size="sm" className="rounded-full">
            <PencilIcon />
            {t("edit")}
          </Button>
        </DrawerTrigger>
      </div>

      <FloaterCart productList={productList} />
    </Drawer>
  );
}
