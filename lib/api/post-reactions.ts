import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import { ReactionRequest, ReactionRequestSchema, UUID, Unit } from "./schemas";

export const postReactions = {
  /**
   * Add or update a reaction to a post
   * 
   * POST /posts/{id}/react
   * 
   * @param postId Post ID to react to
   * @param reaction Reaction type to add
   */
  add: async (
    postId: UUID,
    reaction: ReactionRequest,
    config?: AxiosRequestConfig,
  ): Promise<Unit> => {
    const validatedBody = ReactionRequestSchema.parse(reaction);

    await axiosInstance.post<Unit>(
      `/posts/${postId}/react`,
      validatedBody,
      config,
    );
    
    // No data returned for 204 response
    return;
  },

  /**
   * Remove a reaction from a post
   * 
   * DELETE /posts/{id}/react
   * 
   * @param postId Post ID to remove reaction from
   */
  remove: async (
    postId: UUID,
    config?: AxiosRequestConfig,
  ): Promise<Unit> => {
    await axiosInstance.delete<Unit>(
      `/posts/${postId}/react`,
      config,
    );
    
    // No data returned for 204 response
    return;
  },
};