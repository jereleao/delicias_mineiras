import LocaleDropdown from "~/components/locale-dropdown";
import { FieldSet } from "~/components/ui/field";
import UserAvatar from "~/components/user-avatar";
import type { User } from "~/libs/api/routers/user";

type PreferencesTabProps = Pick<User, "id" | "name" | "bio" | "image">;

export function PreferencesTab({ name, image }: PreferencesTabProps) {
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
