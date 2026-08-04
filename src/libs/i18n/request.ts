import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { env } from "~/env";

export default getRequestConfig(async (params) => {
  const store = await cookies();
  const locale =
    params.locale || store.get("locale")?.value || env.DEFAULT_LANGUAGE;
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
