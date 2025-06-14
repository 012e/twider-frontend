import { useQuery } from "@tanstack/react-query";
import { usePostContext } from "../_stores/post/post-provider";
import * as api from "@/lib/api";
import { useCallback, useEffect } from "react";
import { Comment } from "../_stores/post/post-store";

export function useComments() {
  const postId = usePostContext((state) => state.postId);
  const user = usePostContext((state) => state.user);
  const commentCursors = usePostContext((state) => state.commentCursors);
  const commentRoot = usePostContext((state) => state.commentRoot);
  const { updateComments } = usePostContext((state) => state.actions);

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
      updateComments({
        cursor: undefined,
        isLoading: true,
      });
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
      isLoading: false,
    });
  }, [data, updateComments, commentRoot.replies]);

  useEffect(() => {
    console.log("comments", commentRoot);
  }, [commentRoot]);

  const loadMoreComments = useCallback(
    async (commentId: string) => {
      if (!commentId) {
        throw new Error("Comment ID is required to load more comments.");
      }
      console.log("Loading more comments for commentId:", commentId);
      const cursor = commentCursors.get(commentId) ?? undefined;

      const result = await api.comments.getReplies(postId, commentId, {
        cursor: cursor,
      });

      updateComments({
        isLoading: true,
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

      updateComments({
        isLoading: true,
        parentCommentId: parentId,
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
