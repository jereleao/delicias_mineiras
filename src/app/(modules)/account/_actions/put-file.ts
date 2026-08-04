"use server";

import { put } from "@vercel/blob";

export async function uploadFile(file: File) {
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob;
}
