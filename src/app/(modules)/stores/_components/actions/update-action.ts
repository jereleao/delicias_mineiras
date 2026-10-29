"use server";

import { del } from "@vercel/blob";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import type { CreateStoreType } from "~/libs/db/schemas/stores";
import { api } from "~/libs/trpc/server";

const brandingImageFields = [
  "faviconUrl",
  "logoFullLight",
  "logoFullDark",
  "logoSmallLight",
  "logoSmallDark",
] as const;

function isVercelBlobUrl(value: string) {
  try {
    return new URL(value).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function updateAction(
  storeId: number,
  storeData: CreateStoreType,
  previousSlug?: string,
) {
  const previousStore = previousSlug
    ? await api.store.getBySlug({ slug: previousSlug })
    : null;
  const [store] = await api.store.update({
    id: Number(storeId),
    ...storeData,
  });

  if (!store) return null;

  if (previousStore) {
    const currentImages = new Set(
      brandingImageFields.map((field) => storeData.branding[field]),
    );
    const replacedImages = brandingImageFields
      .map((field) => previousStore.branding[field])
      .filter((url) => url && !currentImages.has(url) && isVercelBlobUrl(url));

    await Promise.all(
      replacedImages.map(async (url) => {
        try {
          await del(url);
        } catch (error) {
          Sentry.captureException(error);
        }
      }),
    );
  }

  revalidatePath("/");
  revalidatePath("/stores");
  revalidatePath(`/stores/${store.slug}`);
  if (previousSlug && previousSlug !== store.slug) {
    revalidatePath(`/stores/${previousSlug}`);
  }

  return store;
}
