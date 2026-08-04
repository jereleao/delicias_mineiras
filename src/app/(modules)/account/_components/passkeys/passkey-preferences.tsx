"use client";

import { Button } from "~/components/ui/button";
import { FieldDescription, FieldSet } from "~/components/ui/field";
import ConditionGuard from "~/components/condition-guard";
import { usePasskeyAvailable } from "~/hooks/use-passkey-available";
import { useWebauthnRegister } from "~/hooks/use-webauthn-register";
import { FingerprintPattern, LoaderCircle } from "lucide-react";
import { api } from "~/libs/trpc/react";
import { CredentialCard } from "./credential-card";
import { CredentialArraySkeleton } from "./credential-card-skeleton";

export default function PasskeyPreferences() {
  const passkeyAvailable = usePasskeyAvailable();

  const [isRegistering, handleRegisterPasskey] = useWebauthnRegister();

  const { data: existingKeys, isPending } = api.user.existingKeys.useQuery();

  return (
    <FieldSet className="pt-2 pl-1">
      <div className="flex justify-between">
        <FieldDescription>
          Check you authentication preferences.
        </FieldDescription>
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
                fallback={<LoaderCircle className="mr-2 animate-spin" />}
              >
                <FingerprintPattern className="mr-2" />
              </ConditionGuard>
              <span>Register passkey on this devide</span>
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
