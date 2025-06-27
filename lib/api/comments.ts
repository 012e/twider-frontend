import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import {
  CommentContent,
  CommentContentSchema,
  CommentUpdate,
  CommentUpdateSchema,
  Comment,
  CommentSchema,
  InfiniteCursorPage,
  InfiniteCursorPageSchema,
  ItemId,
  ItemIdSchema,
  UUID,
  Unit,
} from "./schemas";

export const comments = {
  /**
   * Create a comment on a post, optionally as a reply to another comment
   *
   * POST /posts/{postId}/comments
   * POST /posts/{postId}/comments/{parentCommentId}
   *
   * @param postId ID of the post to comment on
   * @param content Comment content
   * @param parentCommentId Optional parent comment ID (if this is a reply)
   */
  create: async (
    postId: UUID,
    content: CommentContent,
    parentCommentId?: UUID,
    config?: AxiosRequestConfig,
  ): Promise<Comment> => {
    // Validate request body
    const validatedBody = CommentContentSchema.parse(content);

    // Build URL based on whether this is a reply or not
    const url = parentCommentId
      ? `/posts/${postId}/comments/${parentCommentId}`
      : `/posts/${postId}/comments`;

    const response = await axiosInstance.post<Comment>(
      url,
      validatedBody,
      config,
    );

    return CommentSchema.parse(response.data);
  },

  /**
   * Get comments for a post
   *
   * GET /posts/{postId}/comments
   *
   * @param postId ID of the post
   * @param cursor Pagination cursor
   * @param pageSize Number of comments per page
   */
  getByPostId: async (
    postId: UUID,
    { cursor, pageSize }: { cursor?: string; pageSize?: number } = {},
    config?: AxiosRequestConfig,
  ): Promise<InfiniteCursorPage<Comment>> => {
    const PaginatedCommentsSchema = InfiniteCursorPageSchema(CommentSchema);

    const response = await axiosInstance.get<InfiniteCursorPage<Comment>>(
      `/posts/${postId}/comments`,
      { params: { cursor, pageSize }, ...config },
    );

    return PaginatedCommentsSchema.parse(response.data);
  },

  /**
   * Get replies to a specific comment
   *
   * GET /posts/{postId}/comments/{commentId}
   *
   * @param postId ID of the post
   * @param commentId ID of the parent comment
   * @param cursor Pagination cursor
   * @param pageSize Number of replies per page
   */
  getReplies: async (
    postId: UUID,
    commentId: UUID | undefined,
    { cursor, pageSize }: { cursor?: string; pageSize?: number } = {},
    config?: AxiosRequestConfig,
  ): Promise<InfiniteCursorPage<Comment>> => {
    const PaginatedRepliesSchema = InfiniteCursorPageSchema(CommentSchema);

    const path = commentId
      ? `/posts/${postId}/comments/${commentId}`
      : `/posts/${postId}/comments`;

    const response = await axiosInstance.get<InfiniteCursorPage<Comment>>(
      path,
      { params: { cursor, pageSize }, ...config },
    );

    return PaginatedRepliesSchema.parse(response.data);
  },

  /**
   * Update a comment's content
   *
   * PUT /posts/{postId}/comments/{commentId}
   *
   * @param postId ID of the post containing the comment
   * @param commentId ID of the comment to update
   * @param content New comment content
   */
  update: async (
    postId: UUID,
    commentId: UUID,
    content: CommentUpdate,
    config?: AxiosRequestConfig,
  ): Promise<Unit> => {
    const validatedBody = CommentUpdateSchema.parse(content);

    await axiosInstance.put<Unit>(
      `/posts/${postId}/comments/${commentId}`,
      validatedBody,
      config,
    );

    // No data returned for 204 response
    return;
  },

  /**
   * Delete a comment
   *
   * DELETE /posts/{postId}/comments/{commentId}
   *
   * @param postId ID of the post containing the comment
   * @param commentId ID of the comment to delete
   */
  delete: async (
    postId: UUID,
    commentId: UUID,
    config?: AxiosRequestConfig,
  ): Promise<Unit> => {
    await axiosInstance.delete<Unit>(
      `/posts/${postId}/comments/${commentId}`,
      config,
    );

    // No data returned for 204 response
    return;
  },
};

