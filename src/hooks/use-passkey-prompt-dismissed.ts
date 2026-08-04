"use client";

import { useCallback, useEffect, useState } from "react";

const PASSKEY_PROMPT_STORAGE_KEY = "passkey-prompt-dismissed";

export function usePasskeyPromptDismissed() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedValue = window.localStorage.getItem(PASSKEY_PROMPT_STORAGE_KEY);
    setIsDismissed(storedValue === "true");
  }, []);

  const dismiss = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PASSKEY_PROMPT_STORAGE_KEY, "true");
    setIsDismissed(true);
  }, []);

  return { isDismissed, dismiss };
}
