import { Post, postReactions } from "@/lib/api";
import { CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Share, User } from "lucide-react";
import ReactionButton from "./reaction-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PostProvider, usePostContext } from "../_stores/post/post-provider";
import { ReactionType } from "@/lib/api";

interface PostCardProps {
  post: Post;
}

function formatTime(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // e.g. "May"
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} at ${hours}:${minutes}`;
}

function PostHeader() {
  const user = usePostContext((state) => state.user);
  const createdAt = usePostContext((state) => state.createdAt);

  return (
    <div className="flex gap-3 items-center m-3">
      <Link href={`/user/${user.userId}`}>
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={user.profilePicture as string | undefined}
            alt="User"
          />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </Link>

      <Link
        className="flex flex-col justify-center"
        href={`/user/${user.userId}`}
      >
        <CardTitle className="hover:underline">
          <p>{user.username}</p>
        </CardTitle>
        <CardDescription className="hover:underline">
          {formatTime(new Date(createdAt))}
        </CardDescription>
      </Link>
    </div>
  );
}

function PostActions() {
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

  return (
    <div className="grid grid-cols-3 m-1 text-gray-600">
      <ReactionButton
        className="flex justify-center items-center w-full h-full"
        selectedReaction={selectedReaction}
        onClick={async () => {
          await toggleReaction({
            postId,
          });
        }}
        onReactionSelect={(reaction) =>
          reactToPost({
            postId,
            reactionType: reaction,
          })
        }
      />
      <Button
        variant="ghost"
        className="flex justify-center items-center w-full h-full"
      >
        <MessageCircle />
        Comment
      </Button>
      <Button
        variant="ghost"
        className="flex justify-center items-center w-full h-full"
      >
        <Share />
        Share
      </Button>
    </div>
  );
}

function PostContent(post: Post) {
  return (
    <div className="my-1 mx-3">
      <div className="flex gap-3 items-center"></div>
      <div className="mx-2">
        <p>{post.content}</p>
      </div>
    </div>
  );
}

function PostInfo() {
  const reactionCount = usePostContext((state) => state.reactionCount);
  const commentCount = usePostContext((state) => state.commentCount);
  return (
    <div className="flex justify-between p-1 mx-4">
      <div>
        <span className="text-xs text-gray-400">
          {reactionCount ?? 0} reactions
        </span>
      </div>
      <div>
        <span className="text-xs text-gray-400">
          {commentCount ?? 0} comments
        </span>
      </div>
    </div>
  );
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <PostProvider post={post} key={post.postId}>
      <div className="flex flex-col rounded-2xl border shadow-sm bg-card text-card-foreground">
        <PostHeader />
        <PostContent {...post} />
        <PostInfo />
        <Separator />
        <PostActions />
      </div>
    </PostProvider>
  );
}
