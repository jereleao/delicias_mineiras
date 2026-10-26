"use client";

import { useRouter } from "next/navigation";
import { useTransition, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { api } from "~/libs/trpc/react";
import type { StoreEditor } from "~/libs/api/routers/store";
import { Form, FormCheckbox, FormInput } from "~/components/form/client";
import { LoadingButton } from "~/components/ui/button";

import { updateAction } from "../actions/update-action";
import { newAction } from "../actions/new-action";
import {
  createStoreSchema,
  type CreateStoreType,
} from "~/libs/db/schemas/stores";
import { FieldDomains } from "./field-domains";
import { FieldBranding } from "./field-branding";

type StoreFormProps = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  store?: StoreEditor;
};

export function StoreForm({ setOpen, store }: StoreFormProps) {
  const router = useRouter();
  const form = useForm<CreateStoreType, unknown, CreateStoreType>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: store?.name ?? "",
      slug: store?.slug ?? "",
      active: store?.active ?? true,
      domains: store?.domains.map((domain) => ({ domain })) ?? [],
      branding: {
        baseColor: store?.branding.baseColor ?? "#000000",
        metaDescription: store?.branding.metaDescription ?? "",
        faviconUrl: store?.branding.faviconUrl ?? "",
        logoFullLight: store?.branding.logoFullLight ?? "",
        logoFullDark: store?.branding.logoFullDark ?? "",
        logoSmallLight: store?.branding.logoSmallLight ?? "",
        logoSmallDark: store?.branding.logoSmallDark ?? "",
      },
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();
  const t = useTranslations("HomePage.stores.form");

  function onSubmit(data: CreateStoreType) {
    startSaveTransition(async () => {
      try {
        if (store) {
          const changedStore = await updateAction(store.id, data, store.slug);
          if (!changedStore)
            throw new Error("Store update returned no result.");

          utils.store.all.setData(undefined, (old = []) =>
            old.map((existing) =>
              existing.id === changedStore.id
                ? { ...existing, ...changedStore }
                : existing,
            ),
          );
          await utils.store.all.invalidate();
          router.replace(`/stores/${changedStore.slug}`);
          router.refresh();
        } else {
          const newStore = await newAction(data);
          if (!newStore) throw new Error("Store creation returned no result.");

          utils.store.all.setData(undefined, (old = []) => [...old, newStore]);
          await utils.store.all.invalidate();
          setOpen?.(false);
        }
      } catch (error) {
        console.error("Failed to save store:", error);
        toast.error(t("errors.save"));
      }
    });
  }

  return (
    <div className="flex w-full flex-col">
      <Form<CreateStoreType, unknown, CreateStoreType>
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

        <FieldBranding form={form} />

        <FormCheckbox
          control={form.control}
          name="active"
          label={t("fields.active.label")}
        />

        <div className="flex justify-end">
          <LoadingButton type="submit" isLoading={isPendingSave}>
            {t("submit")}
          </LoadingButton>
        </div>
      </Form>
    </div>
  );
}
