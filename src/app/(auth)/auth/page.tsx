import { getTranslations } from "next-intl/server";
import CustomLink from "~/components/custom-link";

type AuthErrorPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AuthErrorPage({
  searchParams,
}: AuthErrorPageProps) {
  const { error = "" } = await searchParams;

  const t = await getTranslations("LoginPage");

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <section className="bg-card text-card-foreground w-full max-w-md rounded-2xl p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">{t("error.title")}</h1>
        <p className="text-muted-foreground mt-3">
          {t("error.options", { error })}
        </p>
        <CustomLink
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-block rounded-lg px-5 py-3 font-medium"
        >
          {t("error.back")}
        </CustomLink>
      </section>
    </main>
  );
}
