"use client";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "next-intl";
import { localesOptions } from "~/libs/i18n/locale-options";
import { changeLocaleAction } from "~/libs/i18n/locale-action";

export default function UserMenuLanguage() {
  const t = useTranslations("UserMenu");

  const locale = useLocale();

  const onSelectLocale = async (selectedLocale: Locale) => {
    if (selectedLocale === locale) return;
    await changeLocaleAction(selectedLocale);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{t("language.label")}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {localesOptions.map((localeOption) => (
            <DropdownMenuItem
              key={localeOption}
              onSelect={() => onSelectLocale(localeOption)}
            >
              {t("language.locale", { locale: localeOption })}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
