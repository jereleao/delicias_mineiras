"use client";

import z from "zod";
import { UserInfoEdit } from "./user-info-edit";
import UserAvatarEdit from "./user-avatar-edit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { ImageCropper } from "./image-cropper";
import { uploadFile } from "../../_actions/put-file";
import { urlToFile } from "~/utils";
import { api } from "~/libs/trpc/react";
import type { UserData } from "~/libs/api/routers/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserProfileEditProps = Pick<UserData, "id" | "name" | "bio" | "image">;

const userInfoSchema = z.object({
  name: z
    .string()
    .min(3, "'Name' must be at least 3 characters.")
    .max(32, "'Name' must be at most 32 characters."),
  bio: z.string().max(255, "'Bio' must be at most 255 characters.").optional(),
  image: z.string().optional(),
});

export type UserInfoType = z.infer<typeof userInfoSchema>;

export function UserProfileEdit({
  id,
  name,
  bio,
  image,
}: UserProfileEditProps) {
  const { update: updateSession } = useSession();
  const router = useRouter();

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  const form = useForm<UserInfoType>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: name || undefined,
      bio: bio || undefined,
      image: image || undefined,
    },
  });

  const [isPendingSave, startSaveTransition] = useTransition();

  const { mutateAsync } = api.user.updateMe.useMutation({
    async onSuccess(_, { name, image }) {
      await updateSession({
        name,
        image,
      });

      // necessary to update the return from auth in server components
      router.refresh();
    },
  });

  function onSubmit(data: UserInfoType) {
    const changedImage = !!data.image && data.image != image;

    startSaveTransition(async () => {
      if (changedImage) {
        console.debug("TODO: Delete previous asset from this user");

        const file = await urlToFile(data.image!, `img-${id}.jpg`);

        const uploadedFile = await uploadFile(file);

        data.image = uploadedFile.url;
      }

      await mutateAsync(data);
    });
  }

  const saveCroppedImg = (imageSrc: string) => {
    form.setValue("image", imageSrc);
    setAvatarSrc(null);
  };

  if (avatarSrc) {
    return (
      <ImageCropper
        image={avatarSrc}
        saveCroppedImg={saveCroppedImg}
        handleCancel={() => setAvatarSrc(null)}
      />
    );
  }

  return (
    <div className="flex w-full flex-col-reverse md:flex-row">
      <UserInfoEdit form={form} onSubmit={onSubmit} isPending={isPendingSave} />
      <UserAvatarEdit form={form} setAvatarSrc={setAvatarSrc} />
    </div>
  );
}
