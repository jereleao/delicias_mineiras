"use client";

import { bannerSchema, type BannerFormType } from "../../_actions/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import { useState, useTransition, type Dispatch } from "react";
import { BannerImageField } from "./banner-image-field";
import { ImageCropper } from "./image-cropper";
import type { CreateBannerType } from "~/libs/db/schemas/banners";
import { urlToFile } from "~/utils";
import { uploadFile } from "~/libs/storage/action/upload-file";
import { newAction } from "../../_actions/new-action";
import { updateAction } from "../../_actions/update-action";
import { Form, FormInput, FormTextarea } from "~/components/form/client";
import { LoadingButton } from "~/components/ui/button";
import { useTranslations } from "next-intl";

type BannerFormProps = {
  setOpen: Dispatch<boolean>;
  banner?: BannerFormType;
};

export function BannerForm({ setOpen, banner }: BannerFormProps) {
  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      id: banner?.id ?? 0,
      title: banner?.title ?? "",
      description: banner?.description ?? "",
      imageUrl: banner?.imageUrl,
    },
  });

  const [unformattedImageSrc, setUnformattedImageSrc] = useState<string | null>(
    null,
  );

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: BannerFormType) {
    const changedImage = data.imageUrl != banner?.imageUrl;

    startSaveTransition(async () => {
      const bannerData: CreateBannerType = {
        ...data,
        title: data.title ?? "",
        description: data.description ?? "",
      };

      if (changedImage) {
        console.debug("TODO: Delete previous asset from this user");

        const sanitizedName = data.title.replace(/[#-.]|[[-^]|[?|{}]| /g, "");

        const file = await urlToFile(
          data.imageUrl,
          `banner-img-${sanitizedName}.jpg`,
        );

        const uploadedFile = await uploadFile(file);

        bannerData.imageUrl = uploadedFile.url;
      }

      if (banner) {
        const changedBanner = await updateAction(banner.id, bannerData);

        utils.banner.all.setData(undefined, (old = []) =>
          old.map((o) => (o.id == changedBanner?.id ? changedBanner : o)),
        );
      } else {
        const newBanner = await newAction(bannerData);

        if (newBanner) {
          utils.banner.all.setData(undefined, (old = []) => [
            ...old,
            newBanner,
          ]);
        }
      }

      await utils.banner.all.invalidate();

      setOpen(false);
    });
  }

  const saveCroppedImg = (imageSrc: string) => {
    form.setValue("imageUrl", imageSrc);
    setUnformattedImageSrc(null);
  };

  const t = useTranslations("AdminPage.banners.form");

  if (unformattedImageSrc) {
    return (
      <ImageCropper
        image={unformattedImageSrc}
        saveCroppedImg={saveCroppedImg}
        handleCancel={() => setUnformattedImageSrc(null)}
      />
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Form
        form={form}
        onValid={onSubmit}
        onInvalid={(errors, _event) => console.warn("onInvalid: ", errors)}
      >
        <FormInput
          control={form.control}
          name="title"
          label={t("fields.title.label")}
          placeholder={t("fields.title.placeholder")}
          autoComplete="off"
        />

        <FormTextarea
          control={form.control}
          name="description"
          label={t("fields.description.label")}
          description={t("fields.description.description")}
          lengthCounter={100}
        />

        <BannerImageField
          form={form}
          setUnformattedImageSrc={setUnformattedImageSrc}
        />

        <div>
          <LoadingButton type="submit" isLoading={isPendingSave}>
            {t("submit")}
          </LoadingButton>
        </div>
      </Form>
    </div>
  );
}
