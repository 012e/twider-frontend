import { z } from "zod";

// --- Basic Types and Constants ---
export type UUID = string;

// --- Base Schemas ---
export const uuidSchema = z.string().uuid();
export const dateTimeSchema = z.string().datetime();

// --- Item Schemas ---
export const ItemIdSchema = z.object({
  id: uuidSchema,
});
export type ItemId = z.infer<typeof ItemIdSchema>;

// --- User Schemas ---
export const UserSchema = z.object({
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
export type User = z.infer<typeof UserSchema>;

// --- Comment Schemas ---
export const CommentContentSchema = z.object({
  content: z.string().nullable(),
});
export type CommentContent = z.infer<typeof CommentContentSchema>;

export const CommentSchema = z.object({
  commentId: uuidSchema,
  content: z.string().nullable(),
  user: UserSchema,
  createdAt: dateTimeSchema,
  parentCommentId: uuidSchema.nullable(),
  totalReplies: z.number().int(),
});
export type Comment = z.infer<typeof CommentSchema>;

// --- Post Schemas ---
export const CreatePostSchema = z.object({
  content: z.string().min(1),
  mediaIds: z.array(uuidSchema),
});
export type CreatePost = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
  content: z.string().min(1),
});
export type UpdatePost = z.infer<typeof UpdatePostSchema>;

// --- Reaction Schemas ---
export const ReactionStatsSchema = z.object({
  like: z.number().int(),
  love: z.number().int(),
  haha: z.number().int(),
  wow: z.number().int(),
  sad: z.number().int(),
  angry: z.number().int(),
  care: z.number().int(),
});
export type ReactionStats = z.infer<typeof ReactionStatsSchema>;

export const ReactionTypeSchema = z
  .enum(["like", "love", "haha", "wow", "sad", "angry"])
  .nullable();
export type ReactionType = z.infer<typeof ReactionTypeSchema>;

export const ReactionRequestSchema = z.object({
  reactionType: ReactionTypeSchema,
});
export type ReactionRequest = z.infer<typeof ReactionRequestSchema>;

// --- Post Response Schemas ---
export const PostSchema = z.object({
  postId: uuidSchema,
  content: z.string().nullable(),
  user: UserSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema.nullable(),
  reactions: ReactionStatsSchema,
  reactionCount: z.number().int(),
  commentCount: z.number().int(),
  mediaUrls: z.array(z.string()).nullable(),
  userReaction: ReactionTypeSchema,
});
export type Post = z.infer<typeof PostSchema>;

// --- User Response Schemas ---
export const UserResponseSchema = z.object({
  id: z.number().int().nonnegative().max(2147483647),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

// --- Error Response Schemas ---
export const ProblemDetailsSchema = z
  .object({
    type: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    status: z.number().int().nullable().optional(),
    detail: z.string().nullable().optional(),
    instance: z.string().nullable().optional(),
  })
  .catchall(z.any());
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

// --- Pagination Schemas ---
export const InfiniteCursorPageSchema = <T extends z.ZodSchema<any>>(
  itemSchema: T,
) =>
  z.object({
    items: z.array(itemSchema).optional(),
    nextCursor: z.string().nullable(),
    hasMore: z.boolean(),
  });
export type InfiniteCursorPage<T> = z.infer<
  ReturnType<typeof InfiniteCursorPageSchema<z.ZodSchema<T>>>
>;

// --- Response Types ---
export type Unit = void;

// --- Media Schemas ---
export const MediaUploadResponseSchema = z.object({
  url: z.string(),
  mediumId: uuidSchema,
});
export type MediaUploadResponse = z.infer<typeof MediaUploadResponseSchema>;

// --- Search Schemas ---
export const SearchPostsResponseSchema = InfiniteCursorPageSchema(PostSchema);
export type SearchPostsResponse = z.infer<typeof SearchPostsResponseSchema>;

// --- Comment Update Schema ---
export const CommentUpdateSchema = z.object({
  content: z.string().min(1),
});
export type CommentUpdate = z.infer<typeof CommentUpdateSchema>;

// --- Chat Schemas ---
export const ChatParticipantSchema = z.object({
  userId: uuidSchema,
  username: z.string().nullable(),
  profilePicture: z.string().nullable(),
  joinedAt: dateTimeSchema,
  role: z.string().nullable(),
  lastReadMessageId: uuidSchema.nullable(),
});
export type ChatParticipant = z.infer<typeof ChatParticipantSchema>;

export const MessageSchema = z.object({
  messageId: uuidSchema,
  chatId: uuidSchema,
  userId: uuidSchema.nullable(),
  username: z.string().nullable(),
  profilePicture: z.string().nullable(),
  content: z.string().nullable(),
  sentAt: dateTimeSchema,
  isDeleted: z.boolean(),
});
export type Message = z.infer<typeof MessageSchema>;

export const ChatSchema = z.object({
  chatId: uuidSchema,
  chatName: z.string().nullable(),
  chatType: z.string().nullable(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  messageCount: z.number().int(),
  participants: z.array(ChatParticipantSchema).nullable(),
  lastMessage: MessageSchema,
});
export type Chat = z.infer<typeof ChatSchema>;

export const SendMessageRequestSchema = z.object({
  content: z.string().min(1).max(2000),
});
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
