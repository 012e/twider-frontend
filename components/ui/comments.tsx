"use client";

import { useCallback, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Comment } from "@/app/_stores/post/post-store";
import DefaultFallbackAvatar from "./default-fallback-avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PostCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-card text-card-foreground rounded-lg shadow-sm border border-border ${className}`}
    >
      {children}
    </div>
  );
};

const Content = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`${className}`}>{children}</div>;
};

const Footer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`${className}`}>{children}</div>;
};

export const CommentReplyForm = ({
  onReply = () => {},
  onCancel = () => {},
  value,
  onChange = (value: string) => {},
  isSubmitting = false,
}: {
  onReply?: () => void;
  onCancel?: () => void;
  value?: string;
  onChange?: (value: string) => void;
  isSubmitting?: boolean;
}) => {
  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a reply..."
        className="p-3 w-full rounded-md border resize-none focus:ring-1 focus:ring-offset-1 focus:outline-none min-h-[80px] border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring"
        disabled={isSubmitting}
      />
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button size="sm" onClick={() => onReply()} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Replying...
            </>
          ) : (
            "Reply"
          )}
        </Button>
      </div>
    </div>
  );
};

interface CommentProps {
  comment: Comment;
  className?: string;
  depth?: number;
  maxDepth?: number;
  onReply?: (parentId: string, content: string) => Promise<void>;
  onLoadMoreReplies?: (commentId: string) => Promise<void>;
}

export function CommentComponent({
  comment,
  depth = 0,
  maxDepth = 10,
  onReply = () => Promise.resolve(),
  onLoadMoreReplies = (commentId: string) => Promise.resolve(),
  className = "",
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { mutate: loadMoreReplies, isPending: isLoadingReplies } = useMutation({
    mutationFn: onLoadMoreReplies,
    onError: (error) => {
      console.error("Failed to load more replies:", error);
      toast.error("Failed to load more replies");
    },
  });

  const { mutate: submitReply, isPending: isSubmittingReply } = useMutation({
    mutationFn: async ({
      parentId,
      content,
    }: {
      parentId: string;
      content: string;
    }) => {
      if (!content.trim()) {
        throw new Error("Reply content cannot be empty");
      }
      await onReply(parentId, content);
    },
    onSuccess: () => {
      setReplyContent("");
      setIsReplying(false);
      toast.success("Reply posted successfully");
    },
    onError: (error) => {
      console.error("Failed to post reply:", error);
      toast.error("Failed to post reply");
    },
  });

  if (!comment) {
    throw new Error("Comment data is required");
  }

  const handleReply = useCallback(() => {
    if (replyContent.trim()) {
      submitReply({ parentId: comment.commentId, content: replyContent });
    }
  }, [replyContent, submitReply, comment.commentId]);

  const canNest = depth < maxDepth;
  const username = comment.user.username || "No username";

  const commentNotShown = comment.totalReplies - (comment.replies?.length ?? 0);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PostCard className="border-l-4 border-l-primary/20">
        <Content className="p-4">
          <div className="flex gap-3 items-start">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={comment.user.profilePicture ?? undefined}
                alt={username}
              />
              <DefaultFallbackAvatar />
            </Avatar>
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <span className="font-medium">{username}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="mt-2 text-sm">{comment.content}</p>
            </div>
          </div>
        </Content>
        <Footer className="flex justify-between py-2 px-4 border-t border-border bg-muted/10">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setIsReplying(!isReplying)}
            disabled={isSubmittingReply}
          >
            <MessageSquare className="mr-1 w-3.5 h-3.5" />
            Reply
          </Button>
        </Footer>
      </PostCard>

      {commentNotShown > 0 && canNest && (
        <Button
          variant="link"
          size="sm"
          className="ml-6 text-xs text-muted-foreground"
          onClick={() => loadMoreReplies(comment.commentId)}
          disabled={isLoadingReplies}
        >
          {isLoadingReplies ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Show {commentNotShown} more{" "}
              {commentNotShown > 1 ? "replies" : "reply"}{" "}
            </>
          )}
        </Button>
      )}

      {isReplying && (
        <div className="ml-6">
          <CommentReplyForm
            onReply={handleReply}
            onCancel={() => setIsReplying(false)}
            value={replyContent}
            onChange={setReplyContent}
            isSubmitting={isSubmittingReply}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && canNest && (
        <div className="flex flex-col gap-4 pl-4 ml-6 border-l-2 border-muted">
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.commentId}
              comment={reply}
              depth={depth + 1}
              maxDepth={maxDepth}
              onReply={onReply}
              onLoadMoreReplies={onLoadMoreReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
}
