import * as api from "@/lib/api";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand";

import { enableMapSet } from "immer";
enableMapSet();

type BaseComment = {
  replies?: Comment[];
  totalReplies: number;
  hasMoreReplies?: boolean;
};

export type Comment = {
  commentId: string;
  content: string | null;
  user: api.User;
  createdAt: string;
  parentCommentId: string | null;
} & BaseComment;

export type CommentRoot = BaseComment;

export type PostState = {
  postId: string;
  content: string | null;
  user: api.User;
  createdAt: string;
  updatedAt: string | null;
  reactions: api.ReactionStats;
  reactionCount: number;
  commentCount: number;
  mediaUrls: string[];
  userReaction: api.ReactionType | null;
  commentRoot: CommentRoot;
  commentCursors: Map<string, string>;
};

export type UpdateCommentArgs = {
  comments?: Comment[];
  parentCommentId?: string;
  cursor?: string;
  hasMoreReplies?: boolean;
  onTop?: boolean;
};

export type PostActions = {
  actions: {
    updateUserReaction: (reaction: api.ReactionType) => void;
    removeUserReaction: () => void;
    toggleUserReaction: (reaction: api.ReactionType) => void;
    updateComments: (args: UpdateCommentArgs) => void;
    increaseCommentCount: () => void;
  };
};

export type PostStore = ReturnType<typeof createPostStore>;

export const createPostStore = (initProps: PostState) => {
  return createStore<PostState & PostActions>()(
    immer((set, get) => ({
      ...initProps,
      commentRoot: {
        ...initProps.commentRoot, // Ensure we merge any initial comment root properties
        isLoading: true,
        hasMoreReplies: false,
      },
      commentCursors: new Map<string, string>(),
      actions: {
        updateComments: ({
          comments,
          parentCommentId,
          cursor,
          hasMoreReplies,
          onTop = false,
        }: UpdateCommentArgs) => {
          set((state) => {
            if (!parentCommentId) {
              // state.commentRoot.isLoading = isLoading;
              if (comments) {
                if (!state.commentRoot.replies) {
                  state.commentRoot.replies = [];
                }
                if (onTop) {
                  // If onTop, we want to add the new comments at the top
                  state.commentRoot.replies.unshift(...comments);
                } else {
                  state.commentRoot.replies.push(...comments);
                }
              }
              state.commentRoot.hasMoreReplies = hasMoreReplies ?? false;
              if (cursor) {
                state.commentCursors.set("root", cursor);
              }
              return;
            }

            const queue: (Comment | CommentRoot)[] = [state.commentRoot];
            let foundParent = false;

            while (queue.length > 0) {
              const current = queue.shift();

              if (
                current &&
                "commentId" in current &&
                current.commentId === parentCommentId
              ) {
                // current.isLoading = isLoading;
                if (comments) {
                  if (!current.replies) {
                    current.replies = [];
                  }
                  if (onTop) {
                    // If onTop, we want to add the new comments at the top
                    current.replies.unshift(...comments);
                  } else {
                    current.replies.push(...comments);
                  }
                }
                current.hasMoreReplies = current.totalReplies > 0;
                if (cursor) {
                  state.commentCursors.set(parentCommentId, cursor);
                }
                foundParent = true;
                break;
              }

              if (current && current.replies) {
                for (const reply of current.replies) {
                  queue.push(reply);
                }
              }
            }

            if (!foundParent) {
              console.warn(
                `Parent comment with ID ${parentCommentId} not found.`,
              );
            }
          });
        },
        removeUserReaction: () => {
          set((state) => {
            if (!state.userReaction) {
              return;
            }
            state.reactionCount = (state.reactionCount ?? 0) - 1;
            state.userReaction = null;
          });
        },
        toggleUserReaction: (reaction: api.ReactionType = "like") => {
          set((state) => {
            if (state.userReaction) {
              state.reactionCount = (state.reactionCount ?? 0) - 1;
              state.userReaction = null;
            } else {
              state.reactionCount = (state.reactionCount ?? 0) + 1;
              state.userReaction = reaction;
            }
          });
        },
        increaseCommentCount: () => {
          set((state) => {
            state.commentCount = (state.commentCount ?? 0) + 1;
          });
        },
        updateUserReaction: (reaction: api.ReactionType = "like") => {
          set((state) => {
            if (!reaction) {
              if (!state.userReaction) {
                return;
              }
              state.reactionCount = (state.reactionCount ?? 0) - 1;
              state.userReaction = null;
              return;
            }

            if (!state.userReaction) {
              state.reactionCount = (state.reactionCount ?? 0) + 1;
            }
            state.userReaction = reaction;
          });
        },
      },
    })),
  );
};
