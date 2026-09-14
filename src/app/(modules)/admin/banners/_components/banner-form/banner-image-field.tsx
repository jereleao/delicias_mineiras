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
import Image from "next/image";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FieldError } from "~/components/ui/field";
import type { BannerFormType } from "../../_actions/schema";

type UserAvatarEditProps = {
  form: UseFormReturn<BannerFormType>;
  setUnformattedImageSrc: Dispatch<SetStateAction<string | null>>;
};

export function BannerImageField({
  form,
  setUnformattedImageSrc,
}: UserAvatarEditProps) {
  const [loading, setLoading] = useState(false);
  const { title, imageUrl } = form.getValues();

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
      <div className="-mb-4 flex w-full flex-col">
        <DropZoneArea className="relative flex h-32 w-full items-center justify-center border-0">
          <DropzoneTrigger className="bg-transparent p-0 hover:bg-transparent">
            <Image
              src={imageUrl ?? `/assets/banner-placeholder.png`}
              alt={title ?? "Banner image"}
              width={1024}
              height={256}
              className="h-30 w-full rounded-xl"
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
        <div className="flex justify-between">
          <DropzoneMessage />
          <FieldError errors={[formState.errors.imageUrl]} />
        </div>
      </div>
    </Dropzone>
  );
}
