import * as React from "react";
import { usePostContext } from "./stores/post-provider";
import { postReactions } from "@/lib/api";
import { ReactionType } from "@/lib/api";
import { MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactionButton from "./reaction-button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CommentList } from "./comment-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function usePostActionsLogic() {
  const { updateUserReaction, removeUserReaction, toggleUserReaction } =
    usePostContext((state) => state.actions);
  const postId = usePostContext((state) => state.postId);
  const selectedReaction = usePostContext((state) => state.userReaction);

  const { mutateAsync: reactToPost } = useMutation({
    mutationFn: async ({
      postId,
      reactionType,
    }: {
      postId: string;
      reactionType: ReactionType;
    }) => {
      updateUserReaction(reactionType);

      return await postReactions.add(postId, {
        reactionType: reactionType,
      });
    },

    onError: () => {
      removeUserReaction();
      toast.error("Error adding reaction");
    },
  });

  const { mutateAsync: toggleReaction } = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      toggleUserReaction("like");
      if (!selectedReaction) {
        return await postReactions.add(postId, {
          reactionType: "like",
        });
      }
      return await postReactions.remove(postId);
    },

    onError: () => {
      toast.error("Error remove reaction");
    },
  });

  return {
    postId,
    selectedReaction,
    reactToPost,
    toggleReaction,
  };
}

export function PostReactionButton() {
  const { postId, selectedReaction, reactToPost, toggleReaction } =
    usePostActionsLogic();
  return (
    <ReactionButton
      className="flex justify-center items-center w-full h-full"
      selectedReaction={selectedReaction}
      onClick={async () => {
        await toggleReaction({
          postId,
        });
      }}
      onReactionSelect={(reaction: ReactionType) =>
        reactToPost({
          postId,
          reactionType: reaction,
        })
      }
    />
  );
}

interface PostCommentDialogProps {
  children: React.ReactNode;
}

export function PostCommentDialog({ children }: PostCommentDialogProps) {
  const postId = usePostContext((state) => state.postId);
  const comments = usePostContext((state) => state.commentRoot);
  const commentCount = usePostContext((state) => state.commentCount);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col overflow-y-scroll w-1/2 h-5/6 max-h-screen lg:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle asChild>
            <h1>Comments</h1>
          </DialogTitle>
          <DialogDescription asChild>
            <p className="text-sm text-gray-500">{commentCount} comments</p>
          </DialogDescription>
        </DialogHeader>
        <CommentList key={postId} />
      </DialogContent>
    </Dialog>
  );
}

export function PostShareButton() {
  return (
    <Button
      variant="ghost"
      className="flex justify-center items-center w-full h-full"
    >
      <Share />
      Share
    </Button>
  );
}

export function PostActions() {
  return (
    <div className="grid grid-cols-3 m-1 text-gray-600">
      <PostReactionButton />
      <PostCommentDialog>
        <Button
          variant="ghost"
          className="flex justify-center items-center w-full h-full"
        >
          <MessageCircle />
          Comment
        </Button>
      </PostCommentDialog>
      <PostShareButton />
    </div>
  );
}
