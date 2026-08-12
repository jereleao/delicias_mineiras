import Link from "next/link";
import { Form } from "~/components/form";
import LocaleDropdown from "~/components/locale-dropdown";
import { Button, LoadingButton } from "~/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import UserAvatar from "~/components/user-avatar";
import type { UserData } from "~/libs/api/routers/user";

type PreferencesTabProps = Pick<UserData, "id" | "name" | "bio" | "image">;

export function PreferencesTab({ id, name, bio, image }: PreferencesTabProps) {
  return (
    <div className="flex w-full flex-col-reverse md:flex-row">
      <FieldSet className="w-full max-w-lg pt-2 pl-1">
        <div>
          <LocaleDropdown />
        </div>
      </FieldSet>
      <div className="mx-auto flex size-24 items-center justify-center">
        <UserAvatar name={name} image={image} className="size-20" />
      </div>
    </div>
  );
}
