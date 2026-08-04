"use client";

import { useState, useTransition } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useCropper } from "~/hooks/use-cropper";

type ImageCropperProps = {
  image: string;
  saveCroppedImg: (imageSrc: string) => void;
  handleCancel: () => void;
};

export function ImageCropper({
  image,
  saveCroppedImg,
  handleCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const { getCroppedFile, setCroppedAreaPixels } = useCropper();

  function onCropComplete(_: Area, croppedPixels: Area) {
    setCroppedAreaPixels(croppedPixels);
  }

  const [isPendingSave, startSaveTransition] = useTransition();

  const handleSaveClick = () => {
    startSaveTransition(async () => {
      const croppedImgSrc = await getCroppedFile(image);

      if (!croppedImgSrc) {
        toast("An error occur when trying to convert the image. Try again.");
        return;
      }

      saveCroppedImg(croppedImgSrc);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[calc(100dvh-290px)]">
        <Cropper
          classes={{
            containerClassName: "size-full",
            cropAreaClassName: "",
            mediaClassName: "",
          }}
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropComplete={onCropComplete}
          onCropChange={setCrop}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={handleCancel} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} disabled={isPendingSave}>
          Save selection
        </Button>
      </div>
    </div>
  );
}
