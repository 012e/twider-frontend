import { AxiosRequestConfig } from "axios";
import axiosInstance from "../app-axios";
import {
  Chat,
  ChatSchema,
  Message,
  MessageSchema,
  SendMessageRequest,
  SendMessageRequestSchema,
  InfiniteCursorPage,
  InfiniteCursorPageSchema,
  ItemId,
  ItemIdSchema,
  UUID,
} from "./schemas";

export const chat = {
  /**
   * Get all chats for the current user
   * 
   * GET /chat
   * 
   * @param cursor Optional cursor for pagination
   * @param pageSize Number of items per page (required)
   */
  getChats: async (
    pageSize: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ): Promise<InfiniteCursorPage<Chat>> => {
    const params = new URLSearchParams();
    params.append('pageSize', pageSize.toString());
    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await axiosInstance.get<InfiniteCursorPage<Chat>>(
      `/chat?${params.toString()}`,
      config,
    );

    return InfiniteCursorPageSchema(ChatSchema).parse(response.data);
  },

  /**
   * Send a direct message to another user
   * 
   * POST /chat/dm/{otherUserId}
   * 
   * @param otherUserId ID of the user to send message to
   * @param messageContent Message content
   */
  sendDirectMessage: async (
    otherUserId: UUID,
    messageContent: SendMessageRequest,
    config?: AxiosRequestConfig,
  ): Promise<ItemId> => {
    // Validate request body
    const validatedBody = SendMessageRequestSchema.parse(messageContent);

    const response = await axiosInstance.post<ItemId>(
      `/chat/dm/${otherUserId}`,
      validatedBody,
      config,
    );

    return ItemIdSchema.parse(response.data);
  },

  /**
   * Get direct messages between current user and another user
   * 
   * GET /chat/dm/{otherUserId}/messages
   * 
   * @param otherUserId ID of the other user
   * @param pageSize Number of items per page (required)
   * @param before Optional cursor for pagination (messages before this cursor)
   * @param after Optional cursor for pagination (messages after this cursor)
   */
  getDirectMessages: async (
    otherUserId: UUID,
    pageSize: number,
    before?: string,
    after?: string,
    config?: AxiosRequestConfig,
  ): Promise<InfiniteCursorPage<Message>> => {
    const params = new URLSearchParams();
    params.append('pageSize', pageSize.toString());
    if (before) {
      params.append('before', before);
    }
    if (after) {
      params.append('after', after);
    }

    const response = await axiosInstance.get<InfiniteCursorPage<Message>>(
      `/chat/dm/${otherUserId}/messages?${params.toString()}`,
      config,
    );

    return InfiniteCursorPageSchema(MessageSchema).parse(response.data);
  },
};
