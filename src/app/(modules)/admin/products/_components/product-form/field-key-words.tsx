"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  MAX_KEYWORD_COUNT,
  type NewProductFormType,
  type NewProductType,
} from "../../_actions/new-product-schema";
import { Button } from "~/components/ui/button";

type FieldKeyWordsProps = {
  form: UseFormReturn<NewProductFormType, unknown, NewProductType>;
};

export function FieldKeyWords({ form }: FieldKeyWordsProps) {
  const t = useTranslations("AdminPage.products.form");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "keywords",
  });
  return (
    <FieldSet className="gap-4">
      <FieldLegend variant="label">{t("fields.keywords.label")}</FieldLegend>
      <FieldDescription>{t("fields.keywords.description")}</FieldDescription>
      <FieldGroup className="flex flex-row flex-wrap items-center gap-3">
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`keywords.${index}.word`}
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="w-[31.5%]"
              >
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      {...controllerField}
                      id={`keywords-${index}-word`}
                      aria-invalid={fieldState.invalid}
                      placeholder={t("fields.keywords.placeholder")}
                    />

                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => remove(index)}
                        aria-label={`Remove word ${index + 1}`}
                      >
                        <XIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ word: "" })}
          disabled={fields.length >= MAX_KEYWORD_COUNT}
        >
          {t("fields.keywords.add")}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}
