import { Button } from "~/components/ui/button";
import UserAvatar from "~/components/user-avatar";
import { Pencil } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { UserInfoType } from "./user-profile-edit";
import {
  Dropzone,
  DropZoneArea,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone";
import type { Dispatch, SetStateAction } from "react";

type UserAvatarEditProps = {
  form: UseFormReturn<UserInfoType>;
  setAvatarSrc: Dispatch<SetStateAction<string | null>>;
};

export default function UserAvatarEdit({
  form,
  setAvatarSrc,
}: UserAvatarEditProps) {
  const { name, image } = form.getValues();

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    onFileUploaded(result) {
      setAvatarSrc(result);
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  return (
    <Dropzone {...dropzone}>
      <DropZoneArea className="relative mx-auto flex size-24 items-center justify-center border-0">
        <UserAvatar name={name} image={image} className="size-20" />
        <DropzoneTrigger className="absolute right-0 bottom-0 bg-transparent p-0 hover:bg-transparent">
          <Button
            className="hover:bg-primary size-7 rounded-full px-1.5"
            asChild
          >
            <Pencil className="size-4" />
          </Button>
        </DropzoneTrigger>
      </DropZoneArea>
      <div className="flex justify-between">
        <DropzoneMessage />
      </div>
    </Dropzone>
  );
}
