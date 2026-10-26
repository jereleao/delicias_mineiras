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

import { Button } from "~/components/ui/button";
import type { CreateStoreType } from "~/libs/db/schemas/stores";

type FieldDomainsProps = {
  form: UseFormReturn<CreateStoreType>;
};

export function FieldDomains({ form }: FieldDomainsProps) {
  const t = useTranslations("HomePage.stores.form");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "domains",
  });

  return (
    <FieldSet className="gap-4">
      <FieldLegend variant="label">{t("fields.domains.label")}</FieldLegend>
      <FieldDescription>{t("fields.domains.description")}</FieldDescription>
      <FieldGroup className="flex flex-row flex-wrap items-center gap-3">
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`domains.${index}.domain`}
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="w-[32.5%]"
              >
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      {...controllerField}
                      id={`domains-${index}`}
                      aria-invalid={fieldState.invalid}
                      placeholder={t("fields.domains.placeholder")}
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
          onClick={() => append({ domain: "" })}
        >
          {t("fields.domains.add")}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}
