"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { FormInput, FormTextarea } from "~/components/form/client";
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import type { CreateStoreType } from "~/libs/db/schemas/stores";

type FieldBrandingProps = {
  form: UseFormReturn<CreateStoreType>;
};

const logoFields = [
  "logoFullLight",
  "logoFullDark",
  "logoSmallLight",
  "logoSmallDark",
] as const;

export function FieldBranding({ form }: FieldBrandingProps) {
  const t = useTranslations("HomePage.stores.form.fields.branding");

  return (
    <FieldSet className="gap-4">
      <FieldLegend variant="label">{t("label")}</FieldLegend>
      <FieldDescription>{t("description")}</FieldDescription>
      <FormInput
        control={form.control}
        name="branding.baseColor"
        label={t("baseColor")}
        type="color"
      />
      <FormTextarea
        control={form.control}
        name="branding.metaDescription"
        label={t("metaDescription")}
      />
      <FormInput
        control={form.control}
        name="branding.faviconUrl"
        label={t("faviconUrl")}
        placeholder={t("urlPlaceholder")}
        autoComplete="off"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {logoFields.map((field) => (
          <FormInput
            key={field}
            control={form.control}
            name={`branding.${field}`}
            label={t(field)}
            placeholder={t("urlPlaceholder")}
            autoComplete="off"
          />
        ))}
      </div>
      <FieldError errors={[form.formState.errors.branding]} />
    </FieldSet>
  );
}
