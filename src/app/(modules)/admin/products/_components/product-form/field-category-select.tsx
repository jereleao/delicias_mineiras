"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import {
  type NewProductFormType,
  type NewProductType,
} from "../../_actions/new-product-schema";
import { LoadingButton } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/libs/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FormBase } from "~/components/form/client/form-base";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";

type FieldCategorySelectProps = {
  form: UseFormReturn<NewProductFormType, unknown, NewProductType>;
};

export default function FieldCategorySelect({
  form,
}: FieldCategorySelectProps) {
  const t = useTranslations("AdminPage.products.form");

  const { data: categoryOptions, isPending: isPendingCategoryOptions } =
    api.category.all.useQuery();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending: isPendingCategoryMutation } =
    api.category.create.useMutation();

  const utils = api.useUtils();

  const addCategory = async (field?: { onChange: (value: string) => void }) => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) return;

    const insertResult = await mutateAsync({ name: trimmedName });

    const newCategory = insertResult.at(0)!;
    const newCategoryId = String(newCategory.id);

    await utils.category.all.invalidate();

    setNewCategoryName("");
    setOpen(false);

    if (field) {
      field.onChange(newCategoryId);
    }

    form.setValue("categoryId", newCategoryId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <FormBase
      control={form.control}
      name="categoryId"
      label={t("fields.categoryId.label")}
      description={t("fields.categoryId.description")}
      render={({ field, fieldState, label, description }) => {
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                {label}{" "}
                {isPendingCategoryOptions && (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                )}
              </FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </FieldContent>
            <Select
              {...field}
              value={
                field.value === undefined || field.value === null
                  ? undefined
                  : String(field.value)
              }
              onValueChange={(value) => {
                field.onChange(value);
              }}
              open={open}
              onOpenChange={setOpen}
            >
              <SelectTrigger
                aria-invalid={fieldState.invalid}
                id={field.name}
                onBlur={field.onBlur}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {categoryOptions?.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id.toString()}>
                    {opt.name}
                  </SelectItem>
                ))}

                <div
                  className="flex items-center gap-2 border-t px-2 py-2"
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Input
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="New category name"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <LoadingButton
                    type="button"
                    size="sm"
                    onClick={() => addCategory()}
                    isLoading={isPendingCategoryMutation}
                  >
                    {"Add"}
                  </LoadingButton>
                </div>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
