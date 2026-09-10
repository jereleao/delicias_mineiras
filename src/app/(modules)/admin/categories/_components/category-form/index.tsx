"use client";

import { Form, FormInput } from "~/components/form/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import { useTransition, type Dispatch } from "react";
import {
  categoryFormSchema,
  type CategoryFormType,
} from "../../_actions/schema";
import { updateCategoryAction } from "../../_actions/update-category-action";
import { addNewCategory } from "../../_actions/add-new-category-action";
import { LoadingButton } from "~/components/ui/button";
import { useTranslations } from "next-intl";

type CategoryFormProps = {
  setOpen: Dispatch<boolean>;
  category?: CategoryFormType;
};

export function CategoryForm({ setOpen, category }: CategoryFormProps) {
  const t = useTranslations("AdminPage.categories.form");

  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: category?.id ?? 0,
      name: category?.name ?? "",
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: CategoryFormType) {
    startSaveTransition(async () => {
      if (category) {
        const changedCategory = await updateCategoryAction(
          category.id,
          data.name,
        );

        utils.category.all.setData(undefined, (old = []) =>
          old.map((o) => (o.id == changedCategory?.id ? changedCategory : o)),
        );
      } else {
        const newCategory = await addNewCategory(data.name);

        if (newCategory) {
          utils.category.all.setData(undefined, (old = []) => [
            ...old,
            newCategory,
          ]);
        }
      }

      await utils.category.all.invalidate();

      setOpen(false);
    });
  }

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

      <div>
        <LoadingButton type="submit" isLoading={isPendingSave}>
          {t("submit")}
        </LoadingButton>
      </div>
    </Form>
  );
}
