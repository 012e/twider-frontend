"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosProgressEvent } from "axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePostFormContext } from "./stores/post-form-provider";
import * as api from "@/lib/api";
import CircularProgress from "@/components/customized/progress/progress-07";
import { Upload } from "lucide-react";
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
  maxFileSize = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ...props
}: ImageUploadComponentProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addImageUploadingProgress, addMediumId } = usePostFormContext(
    (state) => state.actions,
  );

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!file) {
        throw new Error("No file selected for upload");
      }
      const { url: uploadUrl, mediumId } = await api.media.generateUploadUrl();
      addMediumId(file, mediumId);

      const formData = new FormData();
      formData.append("image", file);

      const responsePromise = axios.put(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
    if (
      uploadMutation.isPending ||
      uploadMutation.isSuccess ||
      uploadMutation.isError
    ) {
      return;
    }
    uploadMutation.mutate(medium.file);
  }, [uploadMutation.isPending]);

  const currentImageSrc = medium.previewUrl;
  const isUploading = uploadMutation.isPending;

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <div className="relative">
          <img
            src={currentImageSrc || "/placeholder.svg"}
            alt="Upload preview"
            className="object-cover w-full h-64 rounded-lg border-2 border-gray-300 border-dashed"
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
