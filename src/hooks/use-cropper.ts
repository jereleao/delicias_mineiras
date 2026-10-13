"use client";

import { useState } from "react";
import type { Area } from "react-easy-crop";

const MAX_IMAGE_SIZE = 900 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const MIN_IMAGE_DIMENSION = 256;
const JPEG_QUALITIES = [0.85, 0.7, 0.55, 0.4];

export function useCropper() {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const getCroppedFile = async (selectedImageUrl: string) => {
    if (!croppedAreaPixels) {
      return;
    }

    const result = await getCroppedImg(selectedImageUrl, croppedAreaPixels);

    return result;
  };

  return {
    getCroppedFile,
    setCroppedAreaPixels,
  };
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
) {
  if (!document) throw new Error("Only executable with client component");

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  const outputScale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(pixelCrop.width, pixelCrop.height),
  );
  let outputWidth = Math.max(1, Math.round(pixelCrop.width * outputScale));
  let outputHeight = Math.max(1, Math.round(pixelCrop.height * outputScale));
  croppedCanvas.width = outputWidth;
  croppedCanvas.height = outputHeight;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  while (true) {
    for (const quality of JPEG_QUALITIES) {
      const file = await canvasToBlob(croppedCanvas, quality);

      if (file.size <= MAX_IMAGE_SIZE) {
        return URL.createObjectURL(file);
      }
    }

    if (Math.max(outputWidth, outputHeight) <= MIN_IMAGE_DIMENSION) {
      throw new Error("Image could not be compressed below 900 KiB.");
    }

    const scale = Math.max(
      MIN_IMAGE_DIMENSION / Math.max(outputWidth, outputHeight),
      0.8,
    );
    outputWidth = Math.max(1, Math.round(outputWidth * scale));
    outputHeight = Math.max(1, Math.round(outputHeight * scale));
    croppedCanvas.width = outputWidth;
    croppedCanvas.height = outputHeight;

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight,
    );
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Image conversion failed."));
        }
      },
      "image/jpeg",
      quality,
    );
  });
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export function createImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
