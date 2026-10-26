import { getTranslations } from "next-intl/server";

interface StorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  console.log("slug", slug);

  const t = await getTranslations("AboutPage");

  return <p>{t("title")}</p>;
}
