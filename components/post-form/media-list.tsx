"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ImagePreviewPopup from "./image-preview-popup";
import ImageUploadComponent from "./image-upload-preview";
import { usePostFormContext } from "./stores/post-form-provider";

type ImagePreviewProps = {
  onRemoveImage: (index: number) => void;
};

export default function ImageList({
  onRemoveImage: onRemoveImageCallback,
}: ImagePreviewProps) {
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const images = usePostFormContext((state) => state.images);

  if (!images) {
    return null;
  }

  function handleImageClick(index: number) {
    setOpenImagePreview(true);
    setImageIndex(index);
  }

  function handleCloseImagePreview() {
    setOpenImagePreview(false);
    setImageIndex(0);
  }

  return (
    <div
      className={cn(
        "grid gap-2 mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-w-2xl",
        images.length === 1 && "grid-cols-1",
        images.length === 2 && "grid-cols-2",
        images.length === 3 && "grid-cols-2",
        images.length === 4 && "grid-cols-2",
      )}
    >
      {images.map((img, index) => (
        <div
          key={index}
          className={cn(
            "relative group rounded-lg overflow-hidden",
            images.length === 1 && "max-h-96",
            images.length === 2 && "max-h-48",
            images.length === 3 && index === 0 && "row-span-2 max-h-96",
            images.length === 3 && index !== 0 && "max-h-48",
            images.length === 4 && "max-h-36",
          )}
        >
          <ImageUploadComponent
            medium={img}
            onClick={() => handleImageClick(index)}
            className="object-cover w-full h-full hover:cursor-pointer"
          />
          <button
            onClick={() => onRemoveImageCallback(index)}
            className="absolute top-2 right-2 p-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-black/50"
            aria-label="Remove image"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
      <ImagePreviewPopup
        imageIndex={imageIndex}
        imageUrl={images[imageIndex]?.previewUrl}
        isOpen={openImagePreview}
        onClose={handleCloseImagePreview}
      />
    </div>
  );
}
