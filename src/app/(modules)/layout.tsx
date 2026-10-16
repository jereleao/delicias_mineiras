import { cookies } from "next/headers";

import Footer from "~/components/footer";
import Header from "~/components/header";
import PasskeyAvailability from "~/components/passkey-availability";
import { ScrollArea } from "~/components/ui/scroll-area";

import { CartProvider } from "./_contexts/cart-context";
import { parseCartCookie, type Cart } from "./_contexts/cart";

type IModulesPagesLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function ModulesPagesLayout({
  children,
}: IModulesPagesLayoutProps) {
  const cookieStore = await cookies();
  let initialCart: Cart;

  try {
    initialCart = parseCartCookie(cookieStore.get("cart_product_ids")?.value);
  } catch (error) {
    console.error("Failed to read cart cookie:", error);
    initialCart = { products: [] };
  }

  return (
    <CartProvider initialCart={initialCart}>
      <div className="m-0 flex h-dvh flex-col overflow-hidden antialiased">
        <PasskeyAvailability />
        <Header className="h-12 border-b" />
        <ScrollArea className="h-full overflow-hidden [&_[data-radix-scroll-area-viewport]>div:first-child]:flex! [&_[data-radix-scroll-area-viewport]>div:first-child]:h-full [&_[data-radix-scroll-area-viewport]>div:first-child]:flex-col">
          <main className="relative container mx-auto mb-4 flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </CartProvider>
  );
}
