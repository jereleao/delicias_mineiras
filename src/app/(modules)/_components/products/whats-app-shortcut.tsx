import { useTranslations } from "next-intl";
import Link from "next/link";

import { WhatsAppColor, WhatsAppIconWhite } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { api } from "~/libs/trpc/react";
import type { Product } from "~/libs/api/routers/product";

import { formatPrice } from "./products";

interface WhatsAppShortcutProps {
  productList: Array<Product & { quantity: number }>;
}

export function WhatsAppShortcut({ productList }: WhatsAppShortcutProps) {
  const { data: configuration } = api.config.whatsConfig.useQuery();

  const t = useTranslations("HomePage.cart");

  if (!configuration) return null;

  const total = productList.reduce((sum, product) => {
    return sum + (product ? Number(product.price) * product.quantity : 0);
  }, 0);

  const greeting = `Olá, gostaria de fazer um pedido:
\n${productList.map((product) => `${product.name} - (${product.quantity}) = ${formatPrice(Number(product.price) * product.quantity)}`).join("\n")}
\nTotal: R$ ${total.toFixed(2)}`;

  const whatsAppLink = `https://wa.me/${configuration.phoneNumber}?text=${encodeURIComponent(greeting)}`;

  return (
    <Button asChild className="size-10 rounded-full p-0">
      <Link
        href={whatsAppLink}
        target="_blank"
        rel="noreferrer"
        aria-label={t("whatsapp")}
        className="flex items-center justify-center"
        style={{ backgroundColor: WhatsAppColor }}
      >
        <WhatsAppIconWhite className="size-6" />
      </Link>
    </Button>
  );
}
