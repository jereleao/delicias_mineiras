"use client";

import {
  newProductSchema,
  type NewProductType,
} from "../../_actions/new-product-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import { useState, useTransition, type Dispatch } from "react";
import ProductFormFields from "./product-form-fields";
import { ProductImageField } from "./product-image-field";
import { ImageCropper } from "./image-cropper";
import type { CreateProductType } from "~/libs/db/schemas/products";
import { urlToFile } from "~/utils";
import { uploadFile } from "~/libs/storage/action/upload-file";

type ProductFormProps = {
  setOpen: Dispatch<boolean>;
  product?: NewProductType;
};

export function ProductForm({ setOpen, product }: ProductFormProps) {
  const form = useForm({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: product?.name,
      description: product?.description,
      categoryId: product?.categoryId,
      price: product?.price,
      imageUrl: product?.imageUrl,
      keywords: product?.keywords ?? [{ word: "" }],
    },
  });

  const [unformattedImageSrc, setUnformattedImageSrc] = useState<string | null>(
    null,
  );

  const [isPendingSave, startSaveTransition] = useTransition();

  const { mutateAsync } = api.product.create.useMutation();

  function onSubmit(data: NewProductType) {
    const changedImage = data.imageUrl != product?.imageUrl;

    startSaveTransition(async () => {
      const keywords: string =
        data.keywords?.map((k) => k.word).join("|") ?? "";

      const newProduct: CreateProductType = {
        ...data,
        keywords,
      };

      if (changedImage) {
        console.debug("TODO: Delete previous asset from this user");

        const sanitizedName = data.name.replace(/[#-.]|[[-^]|[?|{}]| /g, "");

        const file = await urlToFile(
          data.imageUrl,
          `product-img-${sanitizedName}.jpg`,
        );

        const uploadedFile = await uploadFile(file);

        newProduct.imageUrl = uploadedFile.url;
      }

      await mutateAsync(newProduct);

      setOpen(false);
    });
  }

  const saveCroppedImg = (imageSrc: string) => {
    form.setValue("imageUrl", imageSrc);
    setUnformattedImageSrc(null);
  };

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
    <div className="flex w-full flex-col-reverse md:flex-row">
      <div className="w-full max-w-lg">
        <ProductFormFields
          form={form}
          onSubmit={onSubmit}
          isPending={isPendingSave}
        />
      </div>

      <ProductImageField
        form={form}
        setUnformattedImageSrc={setUnformattedImageSrc}
      />
    </div>
  );
}
