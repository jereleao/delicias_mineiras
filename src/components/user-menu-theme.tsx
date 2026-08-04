"use client";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export default function UserMenuTheme() {
  const t = useTranslations("UserMenu");

  const { setTheme } = useTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{t("theme.label")}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            {t("theme.light")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            {t("theme.dark")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            {t("theme.system")}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
