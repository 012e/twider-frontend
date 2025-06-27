"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosProgressEvent } from "axios";
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CircularProgress from "@/components/customized/progress/progress-07";

type ImageUploadComponentProps = {
  src?: string;
  enableImageUpload?: boolean;
  getImageUploadUrl: () => Promise<string>;
  onImageUploadSuccess?: (imageUrl: string) => void;
  className?: string;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
} & React.HTMLAttributes<HTMLImageElement>;

export default function ImageUploadComponent({
  src,
  enableImageUpload = true,
  getImageUploadUrl,
  onImageUploadSuccess,
  className = "",
  maxFileSize = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ...props
}: ImageUploadComponentProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (enableImageUpload) {
      getImageUploadUrl().then((url) => {
        uploadUrlRef.current = url;
      });
    }
  }, [enableImageUpload, getImageUploadUrl]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!uploadUrlRef.current) {
        throw new Error("Upload URL not available");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(uploadUrlRef.current, formData, {
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

      return response.data;
    },
    onSuccess: (data) => {
      setUploadProgress(0);
      setError(null);
      const uploadedImageUrl = data.imageUrl || data.url || data;
      onImageUploadSuccess?.(uploadedImageUrl);
    },
    onError: (error: any) => {
      setUploadProgress(0);
      setError(
        error.response?.data?.message || error.message || "Upload failed",
      );
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!acceptedFileTypes.includes(file.type)) {
      setError(
        `Please select a valid image file (${acceptedFileTypes.join(", ")})`,
      );
      return;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    setError(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    uploadMutation.mutate(file);
  };

  const handleUploadClick = () => {
    if (enableImageUpload) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentImageSrc = previewUrl || src;
  const isUploading = uploadMutation.isPending;

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        {currentImageSrc ? (
          <div className="relative">
            <img
              src={currentImageSrc || "/placeholder.svg"}
              alt="Upload preview"
              className="object-cover w-full h-64 rounded-lg border-2 border-gray-300 border-dashed"
              {...props}
            />

            {isUploading && (
              <div className="flex absolute inset-0 flex-col justify-center items-center bg-black bg-opacity-50 rounded-lg">
                <CircularProgress
                  value={uploadProgress}
                  className="mb-2 w-3/4"
                />
              </div>
            )}

            {enableImageUpload && !isUploading && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            {enableImageUpload && !isUploading && (
              <div
                className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-0 rounded-lg opacity-0 transition-all cursor-pointer hover:bg-opacity-30 hover:opacity-100"
                onClick={handleUploadClick}
              >
                <div className="text-center text-white">
                  <Upload className="mx-auto mb-2 w-8 h-8" />
                  <div className="text-sm">Change Image</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center ${
              enableImageUpload
                ? "cursor-pointer hover:border-gray-400 hover:bg-gray-50"
                : "cursor-not-allowed opacity-50"
            } transition-colors`}
            onClick={handleUploadClick}
          >
            <Upload className="mb-4 w-12 h-12 text-gray-400" />
            <div className="text-center text-gray-600">
              <div className="font-medium">
                {enableImageUpload
                  ? "Click to upload an image"
                  : "Image upload disabled"}
              </div>
              {enableImageUpload && (
                <div className="mt-1 text-sm text-gray-500">
                  Max size: {maxFileSize}MB • Formats: JPG, PNG, WebP, GIF
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={!enableImageUpload || isUploading}
      />
    </div>
  );
}
