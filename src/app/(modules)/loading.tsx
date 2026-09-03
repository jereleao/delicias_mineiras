import { LoaderCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default async function DefaultLoading() {
  const t = await getTranslations("Common");

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="min-w-35">
        <CardHeader>
          <CardTitle className="flex justify-center">{t("loading")}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoaderCircleIcon className="size-6 animate-spin" />
        </CardContent>
      </Card>
    </div>
  );
}
