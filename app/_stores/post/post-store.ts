import { GetPostByIdResponse, PostDtoUserDto } from "@/lib/api";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type PostState = GetPostByIdResponse;

export type PostActions = {
  actions: {};
};

// export type PostStore = PostState & PostActions;
export type PostStore = ReturnType<typeof createPostStore>

export const createPostStore = (initProps: PostState) => {
  return createStore<PostState & PostActions>()(
    ((set) => ({
      ...initProps,
      actions: {},
    })),
  );
};
