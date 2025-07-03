import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import { 
  User, 
  UserSchema, 
  Post,
  InfiniteCursorPage,
  InfiniteCursorPageSchema,
  PostSchema,
  UUID,
} from "./schemas";

export const users = {
  /**
   * Get a user by their ID
   * 
   * GET /users/{id}
   * 
   * @param id User ID
   */
  getById: async (
    id: UUID,
    config?: AxiosRequestConfig,
  ): Promise<User> => {
    const response = await axiosInstance.get<User>(
      `/users/${id}`,
      config,
    );
    
    return UserSchema.parse(response.data);
  },

  /**
   * Get the current authenticated user
   * 
   * GET /users/current
   */
  getCurrent: async (
    config?: AxiosRequestConfig,
  ): Promise<User> => {
    const response = await axiosInstance.get<User>(
      '/users/current',
      config,
    );
    
    return UserSchema.parse(response.data);
  },

  /**
   * Get posts by a specific user
   * 
   * GET /users/{userId}/posts
   * 
   * @param userId User ID whose posts to retrieve
   * @param cursor Pagination cursor
   * @param pageSize Number of posts per page
   */
  getPosts: async (
    userId: UUID,
    { cursor, pageSize }: { cursor?: string; pageSize?: number } = {},
    config?: AxiosRequestConfig,
  ): Promise<InfiniteCursorPage<Post>> => {
    const PaginatedPostsSchema = InfiniteCursorPageSchema(PostSchema);

    const response = await axiosInstance.get<InfiniteCursorPage<Post>>(
      `/users/${userId}/posts`,
      { params: { cursor, pageSize }, ...config },
    );
    
    return PaginatedPostsSchema.parse(response.data);
  },
};