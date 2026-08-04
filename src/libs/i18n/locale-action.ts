"use server";

import type { Locale } from "next-intl";
import { cookies } from "next/dist/server/request/cookies";

export async function changeLocaleAction(locale: Locale) {
  const store = await cookies();
  store.set("locale", locale);
}
