import { useQuery } from "@tanstack/react-query";
import { usePostContext } from "../stores/post-provider";
import * as api from "@/lib/api";
import { useCallback, useEffect } from "react";
import { Comment } from "../stores/post-store";

export function useComments() {
  const postId = usePostContext((state) => state.postId);
  const user = usePostContext((state) => state.user);
  const commentCursors = usePostContext((state) => state.commentCursors);
  const commentRoot = usePostContext((state) => state.commentRoot);
  const { updateComments, increaseCommentCount } = usePostContext((state) => state.actions);

  // TODO: fix duplicate query
  const { data, error, isLoading } = useQuery({
    queryKey: ["post", postId, "comments", "root"],
    enabled: !commentRoot.replies,
    queryFn: async () => {
      const response = await api.comments.getByPostId(postId);
      return response;
    },
  });

  useEffect(() => {
    if (commentRoot.replies) {
      return;
    }
    if (!data) {
      return;
    }
    const loadedComments =
      data.items?.map(
        (item) =>
          ({
            ...item,
            isLoading: false,
            hasMoreReplies: data.hasMore,
          }) as Comment,
      ) ?? [];

    updateComments({
      comments: loadedComments,
      cursor: data.nextCursor ?? undefined,
      hasMoreReplies: data.hasMore,
    });
  }, [data, updateComments, commentRoot.replies]);

  const loadMoreComments = useCallback(
    async (commentId: string | undefined) => {
      console.log("Loading more comments for commentId:", commentId ?? "root");
      const cursor = commentCursors.get(commentId ?? "root");
      console.log("Cursor for commentId:", cursor);

      const result = await api.comments.getReplies(postId, commentId, {
        cursor: cursor,
      });

      updateComments({
        comments: result.items,
        parentCommentId: commentId,
        cursor: result.nextCursor ?? undefined,
      });
    },
    [postId, commentCursors],
  );

  const onReply = useCallback(
    async (parentId: string | undefined, content: string) => {
      if (!content) {
        throw new Error("Parent ID and content are required to post a reply.");
      }
      const newComment = await api.comments.create(
        postId,
        {
          content: content,
        },
        parentId,
      );
      increaseCommentCount();

      updateComments({
        parentCommentId: parentId,
        onTop: true,
        comments: [newComment],
      });
    },
    [user],
  );

  return {
    comments: commentRoot,
    error,
    isLoading,
    loadMoreComments,
    onReply,
  };
}
