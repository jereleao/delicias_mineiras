"use client";

import { type Locale, useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { LoadingButton } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { changeLocaleAction } from "~/libs/i18n/locale-action";
import { localesOptions } from "~/libs/i18n/locale-options";

export default function LocaleDropdown() {
  const locale = useLocale();
  const t = useTranslations("UserMenu.language");

  const [isPending, startTransition] = useTransition();

  const onSelectLocale = async (selectedLocale: Locale) => {
    if (selectedLocale === locale) return;
    await changeLocaleAction(selectedLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <LoadingButton variant="outline" isLoading={isPending}>
          {t("label")}
        </LoadingButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(value) =>
              startTransition(() => onSelectLocale(value))
            }
          >
            {localesOptions.map((cur) => (
              <DropdownMenuRadioItem key={cur} value={cur}>
                {t("locale", { locale: cur })}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
