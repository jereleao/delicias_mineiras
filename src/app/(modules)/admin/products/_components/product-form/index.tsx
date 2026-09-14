"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition, type Dispatch } from "react";
import { del } from "@vercel/blob";
import * as Sentry from "@sentry/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/libs/trpc/react";
import type { CreateProductType } from "~/libs/db/schemas/products";
import { urlToFile } from "~/utils";
import { uploadFile } from "~/libs/storage/action/upload-file";
import type { Product } from "~/libs/api/routers/product";
import {
  productSchema,
  type ProductType,
  type ProductFormType,
} from "../../_actions/schema";
import { ProductImageField } from "./product-image-field";
import ProductFormFields from "./product-form-fields";
import { ImageCropper } from "./image-cropper";
import { newAction } from "../../_actions/new-action";
import { updateAction } from "../../_actions/update-action";

type ProductFormProps = {
  setOpen: Dispatch<boolean>;
  product?: ProductFormType;
};

export function ProductForm({ setOpen, product }: ProductFormProps) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id ?? 0,
      name: product?.name,
      description: product?.description,
      categoryId: product?.categoryId,
      price: product?.price,
      imageUrl: product?.imageUrl,
      keywords: product?.keywords ?? [],
    },
  });

  const [unformattedImageSrc, setUnformattedImageSrc] = useState<string | null>(
    null,
  );

  const [isPendingSave, startSaveTransition] = useTransition();

  const utils = api.useUtils();

  function onSubmit(data: ProductType) {
    const changedImage = data.imageUrl != product?.imageUrl;

    startSaveTransition(async () => {
      const keywords: string =
        data.keywords?.map((k) => k.word).join("|") ?? "";

      const productData: CreateProductType = {
        ...data,
        keywords,
      };

      if (changedImage) {
        const sanitizedName = data.name.replace(/[#-.]|[[-^]|[?|{}]| /g, "");

        const file = await urlToFile(
          data.imageUrl,
          `product-img-${sanitizedName}.jpg`,
        );

        const uploadedFile = await uploadFile(file);

        if (product?.imageUrl) {
          try {
            await del(product.imageUrl);
          } catch (error) {
            Sentry.captureException(error);
          }
        }

        productData.imageUrl = uploadedFile.url;
      }

      if (data.id > 0) {
        const updatedProduct = { id: data.id, ...productData };
        const newProduct = await updateAction(updatedProduct);

        if (newProduct) {
          const changedProduct: Product = {
            ...updatedProduct,
            price: updatedProduct.price.toString(),
            active: true,
            categoryName: "",
            ...newProduct,
          };

          utils.product.all.setData(undefined, (old = []) =>
            old.map((o) => (o.id == changedProduct.id ? changedProduct : o)),
          );
        }
      } else {
        const newProduct = await newAction(productData);

        if (newProduct) {
          const changedProduct: Product = {
            ...productData,
            price: data.price.toString(),
            active: true,
            categoryName: "",
            ...newProduct,
          };

          utils.product.all.setData(undefined, (old = []) => [
            ...old,
            changedProduct,
          ]);
        }
      }

      await utils.product.all.invalidate();

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
