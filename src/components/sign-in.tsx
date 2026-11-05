import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLoginUrl } from "~/libs/stores/server";

export function SignIn({
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button {...props}>
      <SignInLink />
    </Button>
  );
}

export async function SignInLink({
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Link>, "href">) {
  const t = await getTranslations("UserMenu");

  const loginUrl = await getLoginUrl();

  return (
    <Link href={loginUrl.toString()} {...props}>
      {t("login")}
    </Link>
  );
}
