"use client";

import { useTransition, type Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/libs/trpc/react";
import type { Store } from "~/libs/api/routers/store";
import { Form, FormInput } from "~/components/form/client";
import { LoadingButton } from "~/components/ui/button";

import { updateAction } from "../actions/update-action";
import { newAction } from "../actions/new-action";
import {
  createStoreSchema,
  type CreateStoreType,
} from "~/libs/db/schemas/stores";
import { FieldDomains } from "./field-domains";

type StoreFormProps = {
  setOpen: Dispatch<boolean>;
  store?: Omit<Store, "active">;
};

export function StoreForm({ setOpen, store }: StoreFormProps) {
  const form = useForm({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: store?.name ?? "",
      slug: store?.slug ?? "",
      domains: store?.domains
        ? store.domains.map((domain) => ({ domain }))
        : [],
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: CreateStoreType) {
    startSaveTransition(async () => {
      if (store) {
        const changedStore = await updateAction(store.id, data);

        utils.store.all.setData(undefined, (old = []) =>
          old.map((o) => (o.id == changedStore?.id ? changedStore : o)),
        );
      } else {
        const newStore = await newAction(data);

        if (newStore) {
          utils.store.all.setData(undefined, (old = []) => [...old, newStore]);
        }
      }

      await utils.store.all.invalidate();

      setOpen(false);
    });
  }

  const t = useTranslations("HomePage.stores.form");

  return (
    <div className="flex w-full flex-col">
      <Form
        form={form}
        onValid={onSubmit}
        onInvalid={(errors, _event) => console.warn("onInvalid: ", errors)}
      >
        <FormInput
          control={form.control}
          name="name"
          label={t("fields.name.label")}
          autoComplete="off"
        />

        <FormInput
          control={form.control}
          name="slug"
          label={t("fields.slug.label")}
          description={t("fields.slug.description")}
          autoComplete="off"
        />

        <FieldDomains form={form} />

        <div>
          <LoadingButton type="submit" isLoading={isPendingSave}>
            {t("submit")}
          </LoadingButton>
        </div>
      </Form>
    </div>
  );
}
