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
      <Header />
      <ScrollArea className="mx-auto min-h-0 w-full max-w-3xl flex-1 px-4 py-4 sm:px-6 md:py-6">
        <main className="min-h-0">{children}</main>
      </ScrollArea>
      <Footer />
    </div>
  );
}
