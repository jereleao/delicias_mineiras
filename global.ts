import type { localesOptions } from "~/libs/i18n/locale-options";
import messages from "./messages/en.json";

declare module "*.css";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof localesOptions)[number];
    Messages: typeof messages;
  }
}
