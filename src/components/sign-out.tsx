"use client";

import { Button } from "~/components/ui/button";
import { useTranslations } from "next-intl";

export function SignOut(
  props: React.ComponentPropsWithRef<typeof Button> & {
    handleLogout: () => void;
  },
) {
  const { handleLogout, ...buttonProps } = props;

  const t = useTranslations("UserMenu");

  return (
    <Button
      variant="ghost"
      className="w-full p-0"
      onClick={handleLogout}
      {...buttonProps}
    >
      {t("logout")}
    </Button>
  );
}
