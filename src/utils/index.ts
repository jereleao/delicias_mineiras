import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNow = () => new Date().getTime();

export const urlToFile = async (imageUrl: string, fileName: string) => {
  // Fetch the data from the image URL
  const response = await fetch(imageUrl);

  // Convert the response data into a binary Blob
  const blob = await response.blob();

  // Create and return the JavaScript File object
  return new File([blob], fileName, { type: blob.type });
};

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function getStoreUrl(slug: string): URL {
  const storeUrl = new URL(env.NEXT_PUBLIC_BASE_URL);
  const baseHostname =
    storeUrl.hostname === "localhost" ? "localtest.me" : storeUrl.hostname;

  storeUrl.hostname = `${slug}.${baseHostname}`;

  return storeUrl;
}
