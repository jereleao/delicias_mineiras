import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Roboto } from "next/font/google";
import { cache } from "react";

import { cn } from "~/utils";
import { env } from "~/env";

import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/libs/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Toaster } from "~/components/ui/sonner";
import { api } from "~/libs/trpc/server";
import { getStoreThemeStyle } from "~/libs/theme/store-theme";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

type RootLayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

const getStoreConfig = cache(() => api.config.storeConfig());

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  const storeConfig = await getStoreConfig();

  const title = storeConfig?.metaTitle ? storeConfig.metaTitle : t("title");
  const description = storeConfig?.metaDescription
    ? storeConfig.metaDescription
    : t("description");

  const faviconUrl = storeConfig?.faviconUrl
    ? storeConfig.faviconUrl
    : "/favicon.ico";

  return {
    title,
    description,
    icons: [{ rel: "icon", url: faviconUrl }],
  };
}

export default async function RootLayout({
  children,
  modal,
}: Readonly<RootLayoutProps>) {
  const storeConfig = await getStoreConfig();

  return (
    <html
      lang="en"
      className={cn(geist.variable, "font-sans", roboto.variable)}
      style={
        storeConfig?.baseColor
          ? getStoreThemeStyle(storeConfig.baseColor)
          : undefined
      }
      suppressHydrationWarning // supress error caused by 'color-scheme'
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
