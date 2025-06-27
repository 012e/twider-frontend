import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import { MediaUploadResponse, MediaUploadResponseSchema } from "./schemas";

export const media = {
  /**
   * Generate a signed URL for media upload
   *
   * POST /media/generate-medium-url
   *
   * @returns Upload URL and medium ID
   */
  generateUploadUrl: async (
    {
      contentType,
    }: {
      contentType: string;
    },
    config?: AxiosRequestConfig,
  ): Promise<MediaUploadResponse> => {
    const response = await axiosInstance.post<MediaUploadResponse>(
      "/media/generate-medium-url",
      { contentType },
      config,
    );

    return MediaUploadResponseSchema.parse(response.data);
  },
};
