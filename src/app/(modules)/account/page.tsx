import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UserProfileEdit } from "./_components/profile/user-profile-edit";
import PasskeyPreferences from "./_components/passkeys/passkey-preferences";
import { api } from "~/libs/trpc/server";

export default async function AccountPage() {
  const userData = await api.user.me();

  if (!userData) redirect("/login");

  return (
    <Tabs defaultValue="profile">
      <TabsList variant="line">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="passkey">Passkeys</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UserProfileEdit {...userData} />
      </TabsContent>
      <TabsContent value="passkey" className="size-full">
        <PasskeyPreferences />
      </TabsContent>
    </Tabs>
  );
}
