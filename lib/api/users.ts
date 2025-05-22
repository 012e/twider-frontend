import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import { UserResponse, UserResponseSchema } from "./schemas";

export const users = {
  /**
   * Get a user by their ID
   * 
   * GET /users/{id}
   * 
   * @param id User ID
   */
  getById: async (
    id: number,
    config?: AxiosRequestConfig,
  ): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>(
      `/users/${id}`,
      config,
    );
    
    return UserResponseSchema.parse(response.data);
  },
};