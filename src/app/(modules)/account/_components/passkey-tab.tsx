"use client";

import { Button } from "~/components/ui/button";
import { FieldDescription, FieldSet } from "~/components/ui/field";
import ConditionGuard from "~/components/condition-guard";
import { usePasskeyAvailable } from "~/hooks/use-passkey-available";
import { useWebauthnRegister } from "~/hooks/use-webauthn-register";
import { FingerprintPatternIcon, LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "~/libs/trpc/react";
import { CredentialCard } from "./passkeys/credential-card";
import { CredentialArraySkeleton } from "./passkeys/credential-card-skeleton";

export function PasskeyTab() {
  const passkeyAvailable = usePasskeyAvailable();
  const t = useTranslations("AccountPage.passkeys");

  const [isRegistering, handleRegisterPasskey] = useWebauthnRegister();

  const { data: existingKeys, isPending } = api.user.existingKeys.useQuery();

  return (
    <FieldSet className="pt-2 pl-1">
      <div className="flex justify-between">
        <FieldDescription>{t("description")}</FieldDescription>
        <ConditionGuard condition={passkeyAvailable}>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="h-10 max-w-100 rounded-full"
              onClick={handleRegisterPasskey}
              disabled={isRegistering}
            >
              <ConditionGuard
                condition={!isRegistering}
                fallback={<LoaderCircleIcon className="mr-2 animate-spin" />}
              >
                <FingerprintPatternIcon className="mr-2" />
              </ConditionGuard>
              <span>{t("register")}</span>
            </Button>
          </div>
        </ConditionGuard>
      </div>
      <div className="flex flex-wrap gap-3">
        <ConditionGuard
          condition={!isPending}
          fallback={<CredentialArraySkeleton />}
        >
          {existingKeys &&
            existingKeys.map((c) => {
              return (
                <CredentialCard key={c.credentialPublicKey} credential={c} />
              );
            })}
        </ConditionGuard>
      </div>
    </FieldSet>
  );
}
