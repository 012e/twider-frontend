"use client";

import { CommentComponent, CommentReplyForm } from "@/components/ui/comments";
import { useComments } from "../_hooks/use-comments";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function EmptyComments() {
  return (
    <div className="p-6 text-center rounded-md text-muted-foreground bg-muted/20">
      No comments yet. Be the first to comment!
    </div>
  );
}

export function CommentList({ className = "" }: { className?: string }) {
  const { comments, loadMoreComments, onReply } = useComments();
  const [newCommentContent, setNewCommentContent] = useState("");

  const { mutate: submitComment, isPending: isSubmittingComment } = useMutation(
    {
      mutationFn: async (content: string) => {
        if (!content.trim()) {
          throw new Error("Comment content cannot be empty");
        }
        await onReply(undefined, content);
      },
      onSuccess: () => {
        setNewCommentContent("");
        toast.success("Comment posted successfully");
      },
      onError: (error) => {
        console.error("Failed to post comment:", error);
        toast.error("Failed to post comment");
      },
    },
  );

  const handleNewCommentSubmit = () => {
    submitComment(newCommentContent);
  };

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <div className="flex justify-between items-center mb-6"></div>

      <div className="flex flex-col gap-5">
        <CommentReplyForm
          onReply={handleNewCommentSubmit}
          value={newCommentContent}
          onChange={setNewCommentContent}
          isSubmitting={isSubmittingComment}
          onCancel={() => setNewCommentContent("")}
        />

        {comments.replies?.length === 0 ? (
          <EmptyComments />
        ) : (
          comments.replies?.map((comment) => (
            <CommentComponent
              key={comment.commentId}
              comment={comment}
              onLoadMoreReplies={loadMoreComments}
              onReply={onReply}
            />
          ))
        )}
      </div>
    </div>
  );
}
