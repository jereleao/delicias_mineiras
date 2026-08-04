"use client";

import { api } from "~/libs/trpc/react";
import { toast } from "sonner";
import { useUserAgentData } from "./use-user-agent-data";
import { startRegistration } from "@simplewebauthn/browser";
import { skipToken } from "@tanstack/react-query";

export function useWebauthnRegister(enabled: boolean = true) {
  const { data: makeCredentialOptions, isPending: isPendingOptions } =
    api.webauthn.makeCredentialOptions.useQuery(
      enabled ? undefined : skipToken,
    );

  const utils = api.useUtils();

  const { mutateAsync: registerCredential, isPending: isPendingMutation } =
    api.webauthn.makeCredential.useMutation({
      onError: (error) => {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Passkey registration failed.",
        );
      },
      onSuccess: () => {
        utils.user.existingKeys.invalidate();
        toast.success("Passkey registration successful.");
      },
    });

  const useragent = useUserAgentData();

  const handleRegisterPasskey = async () => {
    try {
      if (!makeCredentialOptions || !("publicKey" in makeCredentialOptions)) {
        toast("Invalid configured options.");
        throw new Error("Invalid makeCredentialOptions");
      }

      const credentialJSON = await startRegistration(
        makeCredentialOptions.publicKey as any,
      );

      if (!credentialJSON) {
        toast("No credential was created.");
        return;
      }

      const registerBody = Object.assign(credentialJSON, {
        useragent,
      }) as any;

      await registerCredential(registerBody);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Passkey registration failed.",
      );
    }
  };

  const isPending = isPendingOptions || isPendingMutation;

  return [isPending, handleRegisterPasskey] as const;
}
