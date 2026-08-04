"use client";

import { useMemo } from "react";
import { UAParser } from "ua-parser-js";

export function useUserAgentData() {
  const data = useMemo(() => {
    const parser = new UAParser();
    const userAgentData = parser.getResult();

    return {
      browser: userAgentData.browser.name,
      os: userAgentData.os.name + " " + userAgentData.os.version,
      platform: userAgentData.device.type || "desktop",
    };
  }, []);

  return data;
}
