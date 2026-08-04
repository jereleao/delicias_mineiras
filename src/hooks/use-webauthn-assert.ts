"use client";

import { useEffect } from "react";

import { api } from "~/libs/trpc/react";
import { useRouter } from "next/navigation";
import { loginWithPasskey } from "~/libs/auth/actions";
import { useSession } from "next-auth/react";
import { startAuthentication } from "@simplewebauthn/browser";

export function useWebauthnAssert() {
  const router = useRouter();
  const session = useSession();

  const { data: makeAssertionOptions, isPending: isPendingOptions } =
    api.webauthn.makeAssertionOptions.useQuery();

  useEffect(() => {
    if (!makeAssertionOptions || !("publicKey" in makeAssertionOptions)) return;

    if (session.status == "authenticated") return;

    getCredentials(makeAssertionOptions.publicKey);
  }, [makeAssertionOptions, session]);

  const manuallyStartAuthentication = () => {
    if (!makeAssertionOptions || !("publicKey" in makeAssertionOptions))
      throw new Error("Invalid options");

    getCredentials(makeAssertionOptions.publicKey, false);
  };

  const getCredentials = async (
    publicKey: PublicKeyCredentialRequestOptionsJSON,
    useBrowserAutofill: boolean = true,
  ) => {
    const credentialJSON = await startAuthentication(
      publicKey as any,
      useBrowserAutofill,
    );

    if (!credentialJSON) return;

    await loginWithPasskey(credentialJSON as any);

    router.back();
  };

  const isPending = isPendingOptions;

  return [isPending, manuallyStartAuthentication] as const;
}
