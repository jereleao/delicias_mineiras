import { Button } from "~/components/ui/button";
import { FileUpIcon, LoaderCircleIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  Dropzone,
  DropZoneArea,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";
import type { ProductType, ProductFormType } from "../../_actions/schema";
import Image from "next/image";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FieldError } from "~/components/ui/field";

type UserAvatarEditProps = {
  form: UseFormReturn<ProductFormType, unknown, ProductType>;
  setUnformattedImageSrc: Dispatch<SetStateAction<string | null>>;
};

export function ProductImageField({
  form,
  setUnformattedImageSrc,
}: UserAvatarEditProps) {
  const [loading, setLoading] = useState(false);
  const { name, imageUrl } = form.getValues();

  const onFileUploadedCallback = async (imageSrc: string) => {
    setUnformattedImageSrc(imageSrc);

    setLoading(false);
  };

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setLoading(true);
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    onFileUploaded: (result) => void onFileUploadedCallback(result),
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const { formState } = form;

  return (
    <Dropzone {...dropzone}>
      <div className="mx-auto flex w-fit flex-col">
        <DropZoneArea className="relative mx-auto flex size-40 items-center justify-center border-0">
          <DropzoneTrigger className="bg-transparent p-0 hover:bg-transparent">
            <Image
              src={imageUrl ?? `/assets/placeholder.png`}
              alt={name ?? "Product Image"}
              width={400}
              height={400}
              className="size-36 rounded-xl"
              unoptimized
            />

            <Button
              className="hover:bg-primary absolute right-0 bottom-0 size-7 rounded-full px-1.5"
              disabled={loading}
              asChild
            >
              {loading ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : (
                <FileUpIcon className="size-4" />
              )}
            </Button>
          </DropzoneTrigger>
        </DropZoneArea>
        <div className="flex justify-between p-2">
          <DropzoneMessage />
          <FieldError errors={[formState.errors.imageUrl]} />
        </div>
      </div>
    </Dropzone>
  );
}
