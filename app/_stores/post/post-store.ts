import * as api from "@/lib/api";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand";

export type PostState = {
  postId: string;
  content: string | null;
  user: api.User;
  createdAt: string;
  updatedAt: string | null;
  reactions: api.ReactionStats;
  reactionCount: number;
  commentCount: number;
  userReaction: api.ReactionType | null;
};

export type PostActions = {
  actions: {
    updateUserReaction: (reaction: api.ReactionType) => void;
    removeUserReaction: () => void;
    toggleUserReaction: (reaction: api.ReactionType) => void;
  };
};

// export type PostStore = PostState & PostActions;
export type PostStore = ReturnType<typeof createPostStore>;

export const createPostStore = (initProps: PostState) => {
  return createStore<PostState & PostActions>()(
    immer((set) => ({
      ...initProps,
      actions: {
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
