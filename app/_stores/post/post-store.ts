import {
  PostDtoUserDto,
  Reaction,
  ReactionDto,
} from "@/lib/api";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand";

export type PostState = {
  postId: string;
  content: string | null;
  user: PostDtoUserDto;
  createdAt: string;
  updatedAt: string | null;
  reactions: ReactionDto;
  reactionCount: number;
  commentCount: number;
  userReaction: Reaction | null;
};

export type PostActions = {
  actions: {
    updateUserReaction: (reaction: Reaction | null) => void;
  };
};

// export type PostStore = PostState & PostActions;
export type PostStore = ReturnType<typeof createPostStore>;

export const createPostStore = (initProps: PostState) => {
  return createStore<PostState & PostActions>()(
    immer((set) => ({
      ...initProps,
      actions: {
        updateUserReaction: (reaction: Reaction | null) => {
          set((state) => {
            if (!reaction) {
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
