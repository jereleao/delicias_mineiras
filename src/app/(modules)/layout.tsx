import Footer from "~/components/footer";
import Header from "~/components/header";
import PasskeyAvailability from "~/components/passkey-availability";
import { ScrollArea } from "~/components/ui/scroll-area";

type IModulesPagesLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function ModulesPagesLayout({
  children,
}: IModulesPagesLayoutProps) {
  return (
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
  );
}
