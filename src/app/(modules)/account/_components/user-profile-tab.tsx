"use client";

import { Button } from "~/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import UserAvatar from "~/components/user-avatar";
import type { User } from "~/libs/api/routers/user";
import { useTranslations } from "next-intl";
import { useState } from "react";

type UserProfileProps = Pick<User, "id" | "name" | "bio" | "image">;

export function UserProfileTab({
  name,
  bio,
  image,
  children,
}: React.PropsWithChildren<UserProfileProps>) {
  const [editMode, setEditMode] = useState(false);
  const t = useTranslations("AccountPage.profile");

  // return the form component
  if (editMode) return children;

  return (
    <div className="flex w-full flex-col-reverse md:flex-row">
      <FieldSet className="w-full max-w-lg">
        <FieldDescription className="h-5">{t("description")}</FieldDescription>

        <FieldGroup>
          <Field>
            <FieldContent>
              <FieldLabel>{t("displayName")}</FieldLabel>
            </FieldContent>
            <p className="ml-px flex h-8 w-full min-w-0 items-center border-b px-2.5 py-1 text-base md:text-sm">
              {name}
            </p>
          </Field>
          <Field>
            <FieldContent>
              <FieldLabel>{t("bio")}</FieldLabel>
            </FieldContent>
            <p className="ml-px flex field-sizing-content min-h-16 w-full border-b px-2.5 py-2 text-base md:text-sm">
              {bio}
            </p>
          </Field>
          <div>
            <Button onClick={() => setEditMode(true)}>{t("edit")}</Button>
          </div>
        </FieldGroup>
      </FieldSet>
      <div className="mx-auto flex size-24 items-center justify-center">
        <UserAvatar name={name} image={image} className="size-20" />
      </div>
    </div>
  );
}
