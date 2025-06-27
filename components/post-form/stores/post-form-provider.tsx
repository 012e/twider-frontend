import { useContext, useRef } from "react";
import { createPostFormStore, PostFormActions, PostFormState, PostFormStore } from "./post-form-store";
import { PostFormContext } from "./post-form-context";
import { useStore } from "zustand";

type PostFormProviderProps = React.PropsWithChildren<{
  initialContent?: string;
}>;

export function PostFormProvider({ children, initialContent }: PostFormProviderProps) {
  const storeRef = useRef<PostFormStore>(null);
  if (!storeRef.current) {
    storeRef.current = createPostFormStore({ content: initialContent });
  }

  return <PostFormContext value={storeRef.current}>{children}</PostFormContext>;
}

export function usePostFormContext<T>(selector: (state: PostFormActions & PostFormState) => T): T {
  const store = useContext(PostFormContext);
  if (!store) {
    throw new Error("usePostFormContext must be used within a PostFormProvider");
  }
  return useStore(store, selector);
}
