"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { api } from "~/libs/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { LoadingButton } from "~/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import type {
  NewProductFormType,
  NewProductType,
} from "../../_actions/new-product-schema";

type FieldCategorySelectProps = {
  form: UseFormReturn<NewProductFormType, unknown, NewProductType>;
};

export default function FieldCategorySelect({
  form,
}: FieldCategorySelectProps) {
  const t = useTranslations("AdminPage.products.form");

  const { data: categoryOptions = [], isPending: isPendingCategoryOptions } =
    api.category.all.useQuery();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const [pendingNewId, setPendingNewId] = useState<string | null>(null);

  const { mutateAsync, isPending: isPendingCategoryMutation } =
    api.category.create.useMutation();

  const utils = api.useUtils();

  const addCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    const insertResult = await mutateAsync({ name: trimmedName });
    const { id, name } = insertResult.at(0)!;

    const newIdStr = id.toString();

    // This is not synclonous, so I need to add this thing with useEffert to delay the set
    utils.category.all.setData(undefined, (old = []) => [...old, { id, name }]);

    setNewCategoryName("");
    setPendingNewId(newIdStr);
  };

  // Set value only after options list has updated
  useEffect(() => {
    if (pendingNewId) {
      form.setValue("categoryId", pendingNewId, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
      setPendingNewId(null);
      setOpen(false);
    }
  }, [pendingNewId, form]);

  return (
    <Controller
      control={form.control}
      name="categoryId"
      render={({ field, fieldState }) => {
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel>
                {t("fields.categoryId.label")}
                {isPendingCategoryOptions && (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                )}
              </FieldLabel>
              <FieldDescription>
                {t("fields.categoryId.description")}
              </FieldDescription>
            </FieldContent>

            <Select
              value={(field.value as string) ?? ""}
              onValueChange={(value) =>
                form.setValue("categoryId", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
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
                {categoryOptions.map(({ id, name: label }) => (
                  <SelectItem key={id} value={id.toString()}>
                    {label}
                  </SelectItem>
                ))}

                <div
                  className="flex items-center gap-2 border-t px-2 py-2"
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder={t("fields.categoryId.add.placeholder")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <LoadingButton
                    type="button"
                    size="sm"
                    onClick={addCategory}
                    isLoading={isPendingCategoryMutation}
                  >
                    {t("fields.categoryId.add.button")}
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
