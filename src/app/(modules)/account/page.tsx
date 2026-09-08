import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { api } from "~/libs/trpc/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UserProfileTab } from "./_components/user-profile-tab";
import { PasskeyTab } from "./_components/passkey-tab";
import { UserProfileEdit } from "./_components/profile/user-profile-edit";

export default async function AccountPage() {
  const userData = await api.user.me();

  if (!userData) redirect("/login");

  const t = await getTranslations("AccountPage");

  return (
    <Tabs defaultValue="profile">
      <TabsList variant="line">
        <TabsTrigger value="profile">{t("profile.title")}</TabsTrigger>
        <TabsTrigger value="passkey">{t("passkeys.title")}</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UserProfileTab {...userData}>
          <UserProfileEdit {...userData} />
        </UserProfileTab>
      </TabsContent>
      <TabsContent value="passkey" className="size-full">
        <PasskeyTab />
      </TabsContent>
    </Tabs>
  );
}
