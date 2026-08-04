"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  const t = useTranslations("UserMenu");
  return (
    <Button {...props}>
      <Link href="/login">{t("login")}</Link>
    </Button>
  );
}

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
