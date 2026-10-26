"use client";

import { FileUpIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useController, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Dropzone,
  DropZoneArea,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import type { CreateStoreType } from "~/libs/db/schemas/stores";
import { cn } from "~/utils";

export type BrandingImageName =
  | "branding.faviconUrl"
  | "branding.logoFullLight"
  | "branding.logoFullDark"
  | "branding.logoSmallLight"
  | "branding.logoSmallDark";

type BrandingImageFieldProps = {
  form: UseFormReturn<CreateStoreType, unknown, CreateStoreType>;
  name: BrandingImageName;
  label: string;
  onSelectImage: (file: File, name: BrandingImageName) => void;
  onRemoveImage: (name: BrandingImageName) => void;
  classNames?: {
    container?: string;
    dropZone?: string;
  };
};

export function BrandingImageField({
  form,
  name,
  label,
  onSelectImage,
  onRemoveImage,
  classNames,
}: BrandingImageFieldProps) {
  const t = useTranslations("HomePage.stores.form.fields.branding");
  const [loading, setLoading] = useState(false);
  const { field, fieldState } = useController({
    control: form.control,
    name,
  });
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setLoading(true);
      return {
        status: "success",
        result: file,
      };
    },
    onFileUploaded: (file) => {
      setLoading(false);
      if (field.value.startsWith("blob:")) {
        URL.revokeObjectURL(field.value);
      }
      field.onChange(URL.createObjectURL(file));
      onSelectImage(file, name);
    },
    onRootError: () => setLoading(false),
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const { container: containerClassNames, dropZone: dropZoneClassNames } =
    classNames || {};

  return (
    <Field data-invalid={fieldState.invalid} className={containerClassNames}>
      <FieldContent className="justify-between">
        <FieldLabel htmlFor={`${name}-picker`}>{label}</FieldLabel>
        <Dropzone {...dropzone}>
          <DropZoneArea
            className={cn(
              "relative flex w-full items-center justify-center overflow-hidden border-0 p-0",
              dropZoneClassNames,
            )}
          >
            <DropzoneTrigger
              id={`${name}-picker`}
              className="group bg-muted hover:bg-muted relative flex size-full items-center justify-center p-2"
            >
              <Image
                src={field.value || "/assets/placeholder.png"}
                alt={label}
                fill
                className="object-contain"
                unoptimized
              />
              <span className="bg-background/90 absolute right-1 bottom-1 rounded-full p-2 opacity-0 group-hover:opacity-100">
                {loading ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  <FileUpIcon className="size-4" />
                )}
              </span>
            </DropzoneTrigger>
          </DropZoneArea>
          {field.value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="pt-1"
              onClick={(event) => {
                event.stopPropagation();
                if (field.value.startsWith("blob:")) {
                  URL.revokeObjectURL(field.value);
                }
                field.onChange("");
                onRemoveImage(name);
              }}
            >
              <XIcon />
              {t("removeImage")}
            </Button>
          )}
          <DropzoneMessage />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Dropzone>
      </FieldContent>
    </Field>
  );
}
