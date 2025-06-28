"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosProgressEvent } from "axios";
import { toast } from "sonner";
import { usePostFormContext } from "./stores/post-form-provider";
import * as api from "@/lib/api";
import CircularProgress from "@/components/customized/progress/progress-07";
import { MediaFile } from "./stores/post-form-store";

type ImageUploadComponentProps = {
  medium: MediaFile;
  enableImageUpload?: boolean;
  onImageUploadSuccess?: (imageUrl: string) => void;
  className?: string;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
} & React.HTMLAttributes<HTMLImageElement>;

export default function ImageUploadComponent({
  medium,
  onImageUploadSuccess,
  className = "",
  ...props
}: ImageUploadComponentProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const { addImageUploadingProgress, addMediumId } = usePostFormContext(
    (state) => state.actions,
  );

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!file) {
        throw new Error("No file selected for upload");
      }
      const mimeType = file.type;
      console.log("Uploading file with MIME type:", mimeType);

      const { url: uploadUrl, mediumId } = await api.media.generateUploadUrl({
        contentType: mimeType,
      });
      addMediumId(file, mediumId);

      const responsePromise = axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": mimeType,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(progress);
          }
        },
      });

      addImageUploadingProgress(file, responsePromise);

      const response = await responsePromise;

      return response.data;
    },

    onSuccess: (data) => {
      setUploadProgress(0);
      const uploadedImageUrl = data.imageUrl || data.url || data;
      onImageUploadSuccess?.(uploadedImageUrl);
    },

    onError: (error: any) => {
      setUploadProgress(0);
      toast.error("Failed to create post", { description: error.message });
    },
  });

  useEffect(() => {
    if (!uploadMutation.isIdle) {
      return;
    }
    uploadMutation.mutate(medium.file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medium.file, uploadMutation.mutate]);

  const currentImageSrc = medium.previewUrl;
  const isUploading = uploadMutation.isPending;

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <div className="relative">
          <img
            src={currentImageSrc || "/placeholder.svg"}
            alt="Upload preview"
            className="object-cover w-full h-64 rounded-lg"
            {...props}
          />

          {isUploading && (
            <div className="flex absolute inset-0 flex-col justify-center items-center bg-black bg-opacity-50 rounded-lg">
              <CircularProgress value={uploadProgress} className="mb-2 w-3/4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
