"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "~/utils";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type DefaultLoadingProps = {
  className?: string;
};

export default function DefaultLoading({ className }: DefaultLoadingProps) {
  const t = useTranslations("Common");

  return (
    <div className={cn("flex h-full items-center justify-center", className)}>
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
