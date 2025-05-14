/*
GENERATED CODE - CAN EDIT ;)
Generated with gemini 2.5 Flash
Prompt: Generate me axios client for this api. Make it simple, I just need to use it with tanstack query. Use zod for validation.
*/

import  { AxiosInstance, AxiosRequestConfig } from 'axios';
import { z } from 'zod';
import axiosInstance from './app-axios';

// --- Zod Schema Definitions based on OpenAPI Schemas ---
type UUID = string; // UUID is typically a string in APIs


// Basic types and formats
const uuidSchema = z.string().uuid();
const dateTimeSchema = z.string().datetime(); // Zod handles RFC3339/ISO 8601 which OpenAPI date-time usually implies

export const ItemIdSchema = z.object({
  id: uuidSchema,
});
export type ItemId = z.infer<typeof ItemIdSchema>;

export const CommentContentSchema = z.object({
  content: z.string().nullable(),
});
export type CommentContent = z.infer<typeof CommentContentSchema>;

export const CommentDtoUserDtoSchema = z.object({
  userId: uuidSchema,
  oauthSub: z.string().nullable(),
  username: z.string().nullable(),
  email: z.string().nullable(),
  profilePicture: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: dateTimeSchema,
  lastLogin: dateTimeSchema.nullable(),
  isActive: z.boolean(),
  verificationStatus: z.string().nullable(),
});
export type CommentDtoUserDto = z.infer<typeof CommentDtoUserDtoSchema>;

export const CommentDtoSchema = z.object({
  commentId: uuidSchema,
  content: z.string().nullable(),
  user: CommentDtoUserDtoSchema,
  createdAt: dateTimeSchema,
  parentCommentId: uuidSchema.nullable(),
  totalReplies: z.number().int(),
});
export type CommentDto = z.infer<typeof CommentDtoSchema>;

export const CreatePostCommandSchema = z.object({
  content: z.string().min(1),
});
export type CreatePostCommand = z.infer<typeof CreatePostCommandSchema>;

export const UpdatePostContentSchema = z.object({
  content: z.string().min(1),
});
export type UpdatePostContent = z.infer<typeof UpdatePostContentSchema>;

export const ReactionDtoSchema = z.object({
  like: z.number().int(),
  love: z.number().int(),
  haha: z.number().int(),
  wow: z.number().int(),
  sad: z.number().int(),
  angry: z.number().int(),
  care: z.number().int(),
});
export type ReactionDto = z.infer<typeof ReactionDtoSchema>;

export const PostDtoUserDtoSchema = z.object({
  userId: uuidSchema,
  oauthSub: z.string().nullable(),
  username: z.string().nullable(),
  email: z.string().nullable(),
  profilePicture: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: dateTimeSchema,
  lastLogin: dateTimeSchema.nullable(),
  isActive: z.boolean(),
  verificationStatus: z.string().nullable(),
});
export type PostDtoUserDto = z.infer<typeof PostDtoUserDtoSchema>;

export const GetPostByIdResponseSchema = z.object({
  postId: uuidSchema,
  content: z.string().nullable(),
  user: PostDtoUserDtoSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema.nullable(),
  reactions: ReactionDtoSchema,
  reactionCount: z.number().int(),
  commentCount: z.number().int(),
});
export type GetPostByIdResponse = z.infer<typeof GetPostByIdResponseSchema>;

export const ReactionTypeDtoSchema = z.object({
  reactionType: z.string().nullable(), // Assuming reactionType is a string enum, validation could be added here if known
});
export type ReactionTypeDto = z.infer<typeof ReactionTypeDtoSchema>;

export const GetUserByIdResponseSchema = z.object({
  id: z.number().int().nonnegative().max(2147483647),
});
export type GetUserByIdResponse = z.infer<typeof GetUserByIdResponseSchema>;

// MediatR.Unit likely represents an empty response body for 204 No Content
type Unit = void; // No Zod schema needed for void

// Microsoft.AspNetCore.Mvc.ProblemDetails for error responses
export const ProblemDetailsSchema = z.object({
  type: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  status: z.number().int().nullable().optional(),
  detail: z.string().nullable().optional(),
  instance: z.string().nullable().optional(),
}).catchall(z.any()); // Allows for other properties not explicitly listed
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

// Generic Infinite Cursor Page schema
export const InfiniteCursorPageSchema = <T extends z.ZodSchema<any>>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema).nullable(),
    nextCursor: z.string().nullable(),
    hasMore: z.boolean(),
  });
export type InfiniteCursorPage<T> = z.infer<ReturnType<typeof InfiniteCursorPageSchema<z.ZodSchema<T>>>>;

export const health = {
  /**
   * GET /health/hello
   * OperationId: HealthCheckHello
   * Description: OK
   */
  helloGet: async (config?: AxiosRequestConfig): Promise<string> => {
    const response = await axiosInstance.get<string>('/health/hello', config);
    // No Zod schema for plain text string, just return data
    return response.data;
  },
};

export const comments = {
  /**
   * POST /posts/{postId}/comments/{parentCommentId}
   * OperationId: CreateCommentWithParent
   * Description: Created
   * Security: oauth2
   */
  createCommentWithParent: async (
    postId: UUID,
    parentCommentId: UUID,
    body: CommentContent,
    config?: AxiosRequestConfig
  ): Promise<ItemId> => {
    // Validate request body before sending
    const validatedBody = CommentContentSchema.parse(body);

    const response = await axiosInstance.post<ItemId>(
      `/posts/${postId}/comments/${parentCommentId}`,
      validatedBody,
      config
    );
    // Validate response data
    return ItemIdSchema.parse(response.data);
  },

  /**
   * POST /posts/{postId}/comments
   * OperationId: CreateComment
   * Description: Created
   * Security: oauth2
   */
  createComment: async (
    postId: UUID,
    body: CommentContent,
    config?: AxiosRequestConfig
  ): Promise<ItemId> => {
    // Validate request body before sending
    const validatedBody = CommentContentSchema.parse(body);

    const response = await axiosInstance.post<ItemId>(
      `/posts/${postId}/comments`,
      validatedBody,
      config
    );
    // Validate response data
    return ItemIdSchema.parse(response.data);
  },

  /**
   * GET /posts/{postId}/comments
   * OperationId: GetCommentsByPostId
   * Description: OK
   * Query Params: cursor (string), pageSize (integer)
   * Note: OpenAPI spec schema was ambiguous (CommentDto), assuming InfiniteCursorPage<CommentDto> based on query params and /posts endpoint.
   */
  getCommentsByPostId: async (
    postId: UUID,
    params?: { cursor?: string; pageSize?: number },
    config?: AxiosRequestConfig
  ): Promise<InfiniteCursorPage<CommentDto>> => {
    // No request body to validate

    // Define the expected response schema for this specific endpoint
    const PaginatedCommentsSchema = InfiniteCursorPageSchema(CommentDtoSchema);

    const response = await axiosInstance.get<InfiniteCursorPage<CommentDto>>(
      `/posts/${postId}/comments`,
      { params, ...config }
    );
    // Validate response data
    return PaginatedCommentsSchema.parse(response.data);
  },

  /**
   * GET /posts/{postId}/comments/{commentId}
   * OperationId: GetCommentsByPostAndCommentId
   * Description: OK
   * Query Params: cursor (string), pageSize (integer)
   * Note: OpenAPI spec schema was ambiguous (CommentDto), assuming InfiniteCursorPage<CommentDto> based on query params. This likely fetches replies to a specific comment.
   */
  getCommentsByPostAndCommentId: async (
    postId: UUID,
    commentId: UUID,
    params?: { cursor?: string; pageSize?: number },
    config?: AxiosRequestConfig
  ): Promise<InfiniteCursorPage<CommentDto>> => {
    // No request body to validate

    // Define the expected response schema for this specific endpoint
    const PaginatedCommentRepliesSchema = InfiniteCursorPageSchema(CommentDtoSchema);

    const response = await axiosInstance.get<InfiniteCursorPage<CommentDto>>(
      `/posts/${postId}/comments/${commentId}`,
      { params, ...config }
    );
    // Validate response data
    return PaginatedCommentRepliesSchema.parse(response.data);
  },
};

export const postReactions = {
  /**
   * POST /posts/{id}/react
   * OperationId: AddReactionToPost
   * Description: No Content (204) - Returns MediatR.Unit
   */
  addReactionToPost: async (
    id: UUID,
    body: ReactionTypeDto,
    config?: AxiosRequestConfig
  ): Promise<Unit> => {
    // Validate request body before sending
    const validatedBody = ReactionTypeDtoSchema.parse(body);

    const response = await axiosInstance.post<Unit>(
      `/posts/${id}/react`,
      validatedBody,
      config
    );
    // No data to validate for 204
    return response.data; // Will be undefined/void
  },

  /**
   * DELETE /posts/{id}/react
   * OperationId: RemoveReactionFromPost
   * Description: No Content (204) - Returns MediatR.Unit
   */
  removeReactionFromPost: async (
    id: UUID,
    config?: AxiosRequestConfig
  ): Promise<Unit> => {
    const response = await axiosInstance.delete<Unit>(
      `/posts/${id}/react`,
      config
    );
    // No data to validate for 204
    return response.data; // Will be undefined/void
  },
};

export const posts = {
  /**
   * GET /posts/{id}
   * OperationId: GetPostById
   * Description: OK
   */
  getPostById: async (
    id: UUID,
    config?: AxiosRequestConfig
  ): Promise<GetPostByIdResponse> => {
    const response = await axiosInstance.get<GetPostByIdResponse>(
      `/posts/${id}`,
      config
    );
    // Validate response data
    return GetPostByIdResponseSchema.parse(response.data);
  },

  /**
   * DELETE /posts/{id}
   * OperationId: DeletePost
   * Description: No Content (204)
   */
  deletePost: async (id: UUID, config?: AxiosRequestConfig): Promise<Unit> => {
    const response = await axiosInstance.delete<Unit>(
      `/posts/${id}`,
      config
    );
    // No data to validate for 204
    return response.data; // Will be undefined/void
  },

  /**
   * PUT /posts/{id}
   * OperationId: UpdatePost
   * Description: No Content (204) - Returns MediatR.Unit
   */
  updatePost: async (
    id: UUID,
    body: UpdatePostContent,
    config?: AxiosRequestConfig
  ): Promise<Unit> => {
    // Validate request body before sending
    const validatedBody = UpdatePostContentSchema.parse(body);

    const response = await axiosInstance.put<Unit>(
      `/posts/${id}`,
      validatedBody,
      config
    );
    // No data to validate for 204
    return response.data; // Will be undefined/void
  },

  /**
   * POST /posts
   * OperationId: CreatePost
   * Description: Created
   * Security: oauth2
   */
  createPost: async (
    body: CreatePostCommand,
    config?: AxiosRequestConfig
  ): Promise<ItemId> => {
    // Validate request body before sending
    const validatedBody = CreatePostCommandSchema.parse(body);

    const response = await axiosInstance.post<ItemId>(
      '/posts',
      validatedBody,
      config
    );
    // Validate response data
    return ItemIdSchema.parse(response.data);
  },

  /**
   * GET /posts
   * OperationId: GetPosts
   * Description: OK
   * Query Params: cursor (string), pageSize (integer)
   */
  getPosts: async (
    params?: { cursor?: string; pageSize?: number },
    config?: AxiosRequestConfig
  ): Promise<InfiniteCursorPage<GetPostByIdResponse>> => {
    // No request body to validate

    // Define the expected response schema for this specific endpoint
    const PaginatedPostsSchema = InfiniteCursorPageSchema(GetPostByIdResponseSchema);

    const response = await axiosInstance.get<InfiniteCursorPage<GetPostByIdResponse>>(
      '/posts',
      { params, ...config }
    );
    // Validate response data
    return PaginatedPostsSchema.parse(response.data);
  },
};

export const users = {
  /**
   * GET /users/{id}
   * OperationId: GetUserById
   * Description: OK
   * Security: oauth2
   */
  getUserById: async (
    id: number,
    config?: AxiosRequestConfig
  ): Promise<GetUserByIdResponse> => {
    const response = await axiosInstance.get<GetUserByIdResponse>(
      `/users/${id}`,
      config
    );
    // Validate response data
    return GetUserByIdResponseSchema.parse(response.data);
  },
};
