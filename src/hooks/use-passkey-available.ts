"use client";

import { useCallback, useEffect, useState } from "react";

export function usePasskeyAvailable(): boolean {
  const [available, setAvailable] = useState<boolean>(false);

  const check = useCallback(async () => {
    try {
      const result =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setAvailable(result);
    } catch {
      setAvailable(false);
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return available;
}
