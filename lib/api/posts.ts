import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import {
  CreatePost,
  CreatePostSchema,
  Post,
  PostSchema,
  InfiniteCursorPage,
  InfiniteCursorPageSchema,
  ItemId,
  ItemIdSchema,
  UUID,
  UpdatePost,
  UpdatePostSchema,
} from "./schemas";

export const posts = {
  /**
   * Get a post by its ID
   * 
   * GET /posts/{id}
   * 
   * @param id Post ID
   */
  getById: async (
    id: UUID,
    config?: AxiosRequestConfig,
  ): Promise<Post> => {
    const response = await axiosInstance.get<Post>(
      `/posts/${id}`,
      config,
    );
    
    return PostSchema.parse(response.data);
  },

  /**
   * Delete a post
   * 
   * DELETE /posts/{id}
   * 
   * @param id Post ID to delete
   */
  delete: async (
    id: UUID, 
    config?: AxiosRequestConfig
  ): Promise<void> => {
    await axiosInstance.delete(`/posts/${id}`, config);
    // No return data for 204 response
  },

  /**
   * Update a post's content
   * 
   * PUT /posts/{id}
   * 
   * @param id Post ID to update
   * @param content New post content
   */
  update: async (
    id: UUID,
    content: UpdatePost,
    config?: AxiosRequestConfig,
  ): Promise<void> => {
    const validatedBody = UpdatePostSchema.parse(content);

    await axiosInstance.put(
      `/posts/${id}`,
      validatedBody,
      config,
    );
    // No return data for 204 response
  },

  /**
   * Create a new post
   * 
   * POST /posts
   * 
   * @param content Post content
   */
  create: async (
    content: CreatePost,
    config?: AxiosRequestConfig,
  ): Promise<ItemId> => {
    const validatedBody = CreatePostSchema.parse(content);

    const response = await axiosInstance.post<ItemId>(
      "/posts",
      validatedBody,
      config,
    );
    
    return ItemIdSchema.parse(response.data);
  },

  /**
   * Get a paginated list of posts
   * 
   * GET /posts
   * 
   * @param options Pagination options
   */
  getList: async (
    { cursor, pageSize }: { cursor?: string; pageSize?: number } = {},
    config?: AxiosRequestConfig,
  ): Promise<InfiniteCursorPage<Post>> => {
    const PaginatedPostsSchema = InfiniteCursorPageSchema(
      PostSchema,
    );

    const response = await axiosInstance.get<
      InfiniteCursorPage<Post>
    >("/posts", { params: { cursor, pageSize }, ...config });
    
    return PaginatedPostsSchema.parse(response.data);
  },
};