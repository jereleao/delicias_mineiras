"use client";

import { type Locale, useLocale } from "next-intl";
import { changeLocaleAction } from "~/libs/i18n/locale-action";
import { localesOptions } from "~/libs/i18n/locale-options";

export default function LocaleSwitcher() {
  const locale = useLocale();

  const onSelectLocale = async (selectedLocale: Locale) => {
    if (selectedLocale === locale) return;
    await changeLocaleAction(selectedLocale);
  };

  return (
    <div className="flex items-center gap-3">
      {localesOptions.map((cur) => {
        const isActive = cur === locale;
        return (
          <button
            key={cur}
            type="button"
            onClick={() => onSelectLocale(cur)}
            aria-pressed={isActive}
            className={`relative cursor-pointer text-sm uppercase transition-colors duration-300 focus:outline-none ${
              isActive
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {cur}
            <span
              className={`bg-background absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full transition-transform duration-300 ${
                isActive ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
