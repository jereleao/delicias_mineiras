"use client";

import {
  newProductSchema,
  type NewProductFormType,
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
import type { Product } from "~/libs/api/routers/product";

type ProductFormProps = {
  setOpen: Dispatch<boolean>;
  product?: NewProductFormType;
};

export function ProductForm({ setOpen, product }: ProductFormProps) {
  const form = useForm({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      id: product?.id ?? 0,
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

  const { mutateAsync: createNewProductAsync } =
    api.product.create.useMutation();

  const { mutateAsync: updateProductAsync } = api.product.update.useMutation();

  const utils = api.useUtils();

  function onSubmit(data: NewProductType) {
    const changedImage = data.imageUrl != product?.imageUrl;

    startSaveTransition(async () => {
      const keywords: string =
        data.keywords?.map((k) => k.word).join("|") ?? "";

      const productData: CreateProductType = {
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

        productData.imageUrl = uploadedFile.url;
      }

      if (data.id > 0) {
        const updatedProduct = { id: data.id, ...productData };
        await updateProductAsync(updatedProduct);

        const changedProduct: Product = {
          ...updatedProduct,
          price: updatedProduct.price.toString(),
          active: true,
          categoryName: "",
        };

        utils.product.all.setData(undefined, (old = []) =>
          old.map((o) => (o.id == changedProduct.id ? changedProduct : o)),
        );
      } else {
        const insertResult = await createNewProductAsync(productData);

        const newProduct = insertResult.at(0)!;

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
