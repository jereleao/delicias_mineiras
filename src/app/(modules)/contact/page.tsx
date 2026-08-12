import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return <p>{t("title")}</p>;
}
