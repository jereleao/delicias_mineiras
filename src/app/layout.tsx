import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Roboto } from "next/font/google";

import { cn } from "~/utils";
import { env } from "~/env";

import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/libs/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Toaster } from "~/components/ui/sonner";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

type RootLayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("title"),
    description: t("description"),
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
}

export default function RootLayout({
  children,
  modal,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={cn(geist.variable, "font-sans", roboto.variable)}
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme={env.DEFAULT_THEME}
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <SessionProvider>
                <TooltipProvider>
                  {children}
                  {modal}
                  <div id="modal-root" />
                </TooltipProvider>
              </SessionProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
