import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import { ReactionRequest, ReactionRequestSchema, UUID, Unit } from "./schemas";

export const commentReactions = {
  /**
   * Add or update a reaction to a comment
   * 
   * POST /posts/{postId}/comments/{commentId}/reactions
   * 
   * @param postId Post ID containing the comment
   * @param commentId Comment ID to react to
   * @param reaction Reaction type to add
   */
  add: async (
    postId: UUID,
    commentId: UUID,
    reaction: ReactionRequest,
    config?: AxiosRequestConfig,
  ): Promise<Unit> => {
    const validatedBody = ReactionRequestSchema.parse(reaction);

    await axiosInstance.post<Unit>(
      `/posts/${postId}/comments/${commentId}/reactions`,
      validatedBody,
      config,
    );
    
    // No data returned for 201 response
    return;
  },

  /**
   * Remove a reaction from a comment
   * 
   * DELETE /posts/{postId}/comments/{commentId}/reactions
   * 
   * @param postId Post ID containing the comment
   * @param commentId Comment ID to remove reaction from
   */
  remove: async (
    postId: UUID,
    commentId: UUID,
    config?: AxiosRequestConfig,
  ): Promise<Unit> => {
    await axiosInstance.delete<Unit>(
      `/posts/${postId}/comments/${commentId}/reactions`,
      config,
    );
    
    // No data returned for 204 response
    return;
  },
};
