"use client";

import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { LoadingButton } from "~/components/ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Common");

  return (
    <LoadingButton type="submit" isLoading={pending}>
      {t("submit")}
    </LoadingButton>
  );
}
