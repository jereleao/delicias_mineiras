"use client";

import { MinusIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import type { Product } from "~/libs/api/routers/product";
import { useCart } from "~/app/(home)/_contexts/cart-context";
import { formatPrice } from "~/utils";

import { WhatsAppShortcut } from "./whats-app-shortcut";

interface FloaterCartProps {
  productList: Array<Product & { quantity: number }>;
}

export function FloaterCart({ productList }: FloaterCartProps) {
  const t = useTranslations("HomePage.cart");
  const { addProduct, decrementProduct, removeProduct, clearCart } = useCart();

  const total = productList.reduce((sum, product) => {
    return sum + (product ? Number(product.price) * product.quantity : 0);
  }, 0);

  return (
    <DrawerContent className="w-full sm:max-w-md">
      <DrawerHeader className="flex-row items-center justify-between">
        <DrawerTitle>{t("title")}</DrawerTitle>
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("close")}
            className="rounded-full"
          >
            <XIcon />
          </Button>
        </DrawerClose>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
        <ul className="divide-border divide-y">
          {productList.map((product) => {
            return (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {product?.name ?? t("unavailableProduct")}
                  </p>
                  {product && (
                    <p className="text-muted-foreground text-sm">
                      {formatPrice(Number(product.price))}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={t("decreaseQuantity", {
                      product: product?.name ?? t("unavailableProduct"),
                    })}
                    onClick={() => decrementProduct(product.id)}
                  >
                    <MinusIcon />
                  </Button>
                  <span className="min-w-7 text-center font-medium">
                    {product.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={t("increaseQuantity", {
                      product: product?.name ?? t("unavailableProduct"),
                    })}
                    onClick={() => addProduct(product.id)}
                  >
                    <PlusIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("removeProduct", {
                      product: product?.name ?? t("unavailableProduct"),
                    })}
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto flex items-center justify-between border-t py-4 font-semibold">
          <span>{t("total")}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between gap-2 pb-4">
          <Button variant="outline" onClick={clearCart}>
            {t("clear")}
          </Button>
          <WhatsAppShortcut productList={productList} />
        </div>
      </div>
    </DrawerContent>
  );
}
