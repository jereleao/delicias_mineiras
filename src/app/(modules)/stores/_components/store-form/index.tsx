"use client";

import { useRouter } from "next/navigation";
import {
  useTransition,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { api } from "~/libs/trpc/react";
import type { StoreEditor } from "~/libs/api/routers/store";
import {
  Form,
  FormCheckbox,
  FormInput,
  FormTextarea,
} from "~/components/form/client";
import { LoadingButton } from "~/components/ui/button";

import { updateAction } from "../actions/update-action";
import { newAction } from "../actions/new-action";
import {
  createStoreSchema,
  type CreateStoreType,
} from "~/libs/db/schemas/stores";
import { FieldDomains } from "./field-domains";
import { FieldError } from "~/components/ui/field";
import {
  BrandingImageField,
  type BrandingImageName,
} from "./branding-image-field";
import { uploadFile } from "~/libs/storage/action/upload-file";

type StoreFormProps = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  store?: StoreEditor;
};

export function StoreForm({ setOpen, store }: StoreFormProps) {
  const router = useRouter();
  const selectedFiles = useRef(new Map<BrandingImageName, File>());

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
  const imageFields = [
    { brandingKey: "faviconUrl", formName: "branding.faviconUrl" },
    { brandingKey: "logoFullLight", formName: "branding.logoFullLight" },
    { brandingKey: "logoFullDark", formName: "branding.logoFullDark" },
    { brandingKey: "logoSmallLight", formName: "branding.logoSmallLight" },
    { brandingKey: "logoSmallDark", formName: "branding.logoSmallDark" },
  ] as const;

  useEffect(
    () => () => {
      for (const field of selectedFiles.current.keys()) {
        const imageUrl = form.getValues(field);
        if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
      }
      selectedFiles.current.clear();
    },
    [form],
  );

  function onSubmit(data: CreateStoreType) {
    startSaveTransition(async () => {
      try {
        const storeData: CreateStoreType = {
          ...data,
          branding: { ...data.branding },
        };
        const selectedObjectUrls: string[] = [];

        for (const { brandingKey, formName } of imageFields) {
          const imageUrl = storeData.branding[brandingKey];
          const selectedFile = selectedFiles.current.get(formName);
          if (!selectedFile) continue;

          const uploadedFile = await uploadFile(selectedFile);
          storeData.branding[brandingKey] = uploadedFile.url;
          selectedObjectUrls.push(imageUrl);
        }

        if (store) {
          const changedStore = await updateAction(
            store.id,
            storeData,
            store.slug,
          );
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
          const newStore = await newAction(storeData);
          if (!newStore) throw new Error("Store creation returned no result.");

          utils.store.all.setData(undefined, (old = []) => [...old, newStore]);
          await utils.store.all.invalidate();
          setOpen?.(false);
        }

        for (const { brandingKey, formName } of imageFields) {
          if (selectedFiles.current.has(formName)) {
            form.setValue(formName, storeData.branding[brandingKey]);
          }
        }
        selectedObjectUrls.forEach((url) => URL.revokeObjectURL(url));
        selectedFiles.current.clear();
      } catch (error) {
        console.error("Failed to save store:", error);
        toast.error(t("errors.save"));
      }
    });
  }

  const logoFields = [
    "logoFullLight",
    "logoSmallLight",
    "logoFullDark",
    "logoSmallDark",
  ] as const;

  return (
    <div className="flex w-full flex-col">
      <Form<CreateStoreType, unknown, CreateStoreType>
        form={form}
        onValid={onSubmit}
        onInvalid={(errors, _event) => console.warn("onInvalid: ", errors)}
      >
        <div className="flex gap-4">
          <BrandingImageField
            form={form}
            name="branding.faviconUrl"
            label={t("fields.branding.faviconUrl")}
            onSelectImage={(file, name) =>
              selectedFiles.current.set(name, file)
            }
            onRemoveImage={(name) => selectedFiles.current.delete(name)}
            classNames={{
              container: "w-fit",
              dropZone: "size-[40px]",
            }}
          />
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

          <FormInput
            control={form.control}
            name="branding.baseColor"
            label={t("fields.branding.baseColor")}
            type="color"
            classNames={{
              container: "w-[90px]! min-w-[40px]",
              input: "cursor-pointer",
            }}
          />

          <FormCheckbox
            control={form.control}
            name="active"
            label={t("fields.active.label")}
            classNames={{
              container: "w-fit",
              checkbox: "size-8! rounded-full",
            }}
          />
        </div>

        <FieldDomains form={form} />

        <FormTextarea
          control={form.control}
          name="branding.metaDescription"
          label={t("fields.branding.metaDescription")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {logoFields.map((field) => (
            <BrandingImageField
              key={field}
              form={form}
              name={`branding.${field}`}
              label={t(`fields.branding.${field}`)}
              onSelectImage={(file, name) =>
                selectedFiles.current.set(name, file)
              }
              onRemoveImage={(name) => selectedFiles.current.delete(name)}
              classNames={{
                container: "w-fit",
                dropZone: "h-16 w-auto",
              }}
            />
          ))}
          <FieldError errors={[form.formState.errors.branding]} />
        </div>

        <div className="flex justify-end">
          <LoadingButton type="submit" isLoading={isPendingSave}>
            {t("submit")}
          </LoadingButton>
        </div>
      </Form>
    </div>
  );
}
