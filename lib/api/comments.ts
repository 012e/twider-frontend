import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import {
  CommentContent,
  CommentContentSchema,
  Comment,
  CommentSchema,
  InfiniteCursorPage,
  InfiniteCursorPageSchema,
  ItemId,
  ItemIdSchema,
  UUID,
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
  ): Promise<ItemId> => {
    // Validate request body
    const validatedBody = CommentContentSchema.parse(content);
    
    // Build URL based on whether this is a reply or not
    const url = parentCommentId
      ? `/posts/${postId}/comments/${parentCommentId}`
      : `/posts/${postId}/comments`;
    
    const response = await axiosInstance.post<ItemId>(url, validatedBody, config);
    
    return ItemIdSchema.parse(response.data);
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
    commentId: UUID,
    { cursor, pageSize }: { cursor?: string; pageSize?: number } = {},
    config?: AxiosRequestConfig,
  ): Promise<InfiniteCursorPage<Comment>> => {
    const PaginatedRepliesSchema = InfiniteCursorPageSchema(CommentSchema);

    const response = await axiosInstance.get<InfiniteCursorPage<Comment>>(
      `/posts/${postId}/comments/${commentId}`,
      { params: { cursor, pageSize }, ...config },
    );
    
    return PaginatedRepliesSchema.parse(response.data);
  },
};