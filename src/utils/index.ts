import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
