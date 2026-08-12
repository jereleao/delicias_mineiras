import { getTranslations } from "next-intl/server";

import Footer from "~/components/footer";
import Header from "~/components/header";
import { ScrollArea } from "~/components/ui/scroll-area";

type IModulesPagesLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export async function generateMetadata() {
  const t = await getTranslations("Metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ModulesPagesLayout({
  children,
}: IModulesPagesLayoutProps) {
  return (
    <div className="m-0 flex h-dvh flex-col overflow-hidden antialiased">
      <Header className="h-12 border-b" />
      <ScrollArea className="h-full overflow-hidden [&_[data-radix-scroll-area-viewport]>div:first-child]:flex! [&_[data-radix-scroll-area-viewport]>div:first-child]:h-full [&_[data-radix-scroll-area-viewport]>div:first-child]:flex-col">
        <main className="container mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </ScrollArea>
    </div>
  );
}
