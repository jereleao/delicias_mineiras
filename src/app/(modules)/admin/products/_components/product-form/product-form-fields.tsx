"use client";

import type { ProductType, ProductFormType } from "../../_actions/schema";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { Form, FormInput, FormTextarea } from "~/components/form/client";
import { LoadingButton } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import { FieldKeyWords } from "./field-key-words";
import FieldCategorySelect from "./field-category-select";

type ProductFormFieldsProps = {
  form: UseFormReturn<ProductFormType, unknown, ProductType>;
  isPending: boolean;
  onSubmit: SubmitHandler<ProductType>;
};

export default function ProductFormFields({
  form,
  isPending,
  onSubmit,
}: ProductFormFieldsProps) {
  const t = useTranslations("AdminPage.products.form");

  return (
    <Form
      form={form}
      onValid={onSubmit}
      onInvalid={(errors, _event) => console.warn("onInvalid: ", errors)}
    >
      <FormInput
        control={form.control}
        name="name"
        label={t("fields.name.label")}
        description={t("fields.name.description")}
        placeholder={t("fields.name.placeholder")}
        autoComplete="off"
      />

      <FormTextarea
        control={form.control}
        name="description"
        label={t("fields.description.label")}
        description={t("fields.description.description")}
        placeholder={t("fields.description.placeholder")}
        lengthCounter={100}
      />

      <FormInput
        control={form.control}
        name="price"
        label={t("fields.price.label")}
        placeholder="0,00"
        currency="BRL"
      />

      <FieldCategorySelect form={form} />

      <FieldKeyWords form={form} />

      <div>
        <LoadingButton type="submit" isLoading={isPending}>
          {t("submit")}
        </LoadingButton>
      </div>
    </Form>
  );
}
