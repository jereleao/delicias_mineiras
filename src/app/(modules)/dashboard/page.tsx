import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("DashboardPage");

  return <p>{t("title")}</p>;
}
