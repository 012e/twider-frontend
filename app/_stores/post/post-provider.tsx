import { Post } from "@/lib/api";
import { useContext, useRef } from "react";
import { createPostStore, PostActions, PostState, PostStore } from "./post-store";
import { PostContext } from "./post-context";
import { useStore } from "zustand";

type PostProviderProps = React.PropsWithChildren<{
  post: Post;
}>;

export function PostProvider({ children, post }: PostProviderProps) {
  const storeRef = useRef<PostStore>(null);
  if (!storeRef.current) {
    storeRef.current = createPostStore(post);
  }

  return <PostContext value={storeRef.current}>{children}</PostContext>;
}

export function usePostContext<T>(selector: (state: PostActions & PostState) => T): T {
  const store = useContext(PostContext);
  if (!store) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return useStore(store, selector);
}
