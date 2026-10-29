import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StoreForm } from "../_components/store-form";
import { api } from "~/libs/trpc/server";

interface StorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await api.store.getBySlug({ slug });

  if (!store) notFound();

  const t = await getTranslations("HomePage.stores.editor");

  return (
    <section className="flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">
          {t("title", { name: store.name })}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </header>
      <StoreForm store={store} />
    </section>
  );
}
