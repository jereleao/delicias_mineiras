"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { PASSKEY_PROVIDER_ID } from "~/env";
import { usePasskeyAvailable } from "~/hooks/use-passkey-available";
import { useWebauthnRegister } from "~/hooks/use-webauthn-register";
import { api } from "~/libs/trpc/react";
import { useTranslations } from "next-intl";

export default function PasskeyAvailability() {
  const passkeyAvailable = usePasskeyAvailable();

  const session = useSession();

  const { data: userData, isPending: isPendingQuery } = api.user.me.useQuery();

  const enabled =
    userData?.offerPasskey &&
    !isPendingQuery &&
    passkeyAvailable &&
    session.status == "authenticated" &&
    session.data?.provider !== PASSKEY_PROVIDER_ID;

  useEffect(() => {
    if (enabled) {
      setPasskeyDialogOpen(true);
    }
  }, [enabled]);

  const [passkeyDialogOpen, setPasskeyDialogOpen] = useState<boolean>(false);

  const [isRegistering, registerPasskey] = useWebauthnRegister(enabled);

  const { mutate: dismissPasskey, isPending: isPendingMutation } =
    api.user.dismissPasskey.useMutation({
      onSuccess: () => {
        setPasskeyDialogOpen(false);
      },
    });

  const handleDismissPasskey = () => {
    dismissPasskey();
  };

  const handleRegisterPasskey = async () => {
    await registerPasskey();

    setPasskeyDialogOpen(false);
  };

  const t = useTranslations("PasskeyAvailability");

  return (
    <Dialog open={passkeyDialogOpen} onOpenChange={setPasskeyDialogOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleDismissPasskey}
            disabled={isPendingMutation}
          >
            {t("dismiss")}
          </Button>
          <Button onClick={handleRegisterPasskey} disabled={isRegistering}>
            {t("register")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
