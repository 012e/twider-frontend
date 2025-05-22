import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";

export const health = {
  /**
   * Check API health status
   * 
   * GET /health/hello
   */
  check: async (config?: AxiosRequestConfig): Promise<string> => {
    const response = await axiosInstance.get<string>("/health/hello", config);
    return response.data;
  },
};