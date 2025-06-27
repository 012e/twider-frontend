import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import { SearchPostsResponse, SearchPostsResponseSchema } from "./schemas";

export const search = {
  /**
   * Search posts using ML-powered hybrid search
   * 
   * GET /search/posts
   * 
   * @param query Search query string
   * @param cursor Pagination cursor
   * @param pageSize Number of results per page
   */
  posts: async (
    query: string,
    { cursor, pageSize }: { cursor?: string; pageSize?: number } = {},
    config?: AxiosRequestConfig,
  ): Promise<SearchPostsResponse> => {
    const response = await axiosInstance.get<SearchPostsResponse>(
      '/search/posts',
      { params: { query, cursor, pageSize }, ...config },
    );
    
    return SearchPostsResponseSchema.parse(response.data);
  },
};
