import { GetPostByIdResponse as Post, postReactions } from "@/lib/api"; // Import Post type
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
import { Reaction as ReactionType } from "@/lib/api";

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
  const { updateUserReaction } = usePostContext((state) => state.actions);
  const postId = usePostContext((state) => state.postId);
  const selectedReaction = usePostContext((state) => state.userReaction);

  const { mutateAsync } = useMutation({
    mutationFn: async ({
      postId,
      reactionType,
    }: {
      postId: string;
      reactionType: ReactionType;
    }) => {
      return await postReactions.reactionToPost(postId, {
        reactionType: reactionType,
      });
    },

    onSuccess: (_, { reactionType }) => {
      updateUserReaction(reactionType);
    },

    onError: () => {
      updateUserReaction(null);
      toast.error("Error adding reaction");
    },
  });

  return (
    <div className="grid grid-cols-3 m-1 text-gray-600">
      <ReactionButton
        className="flex justify-center items-center w-full h-full"
        selectedReaction={selectedReaction}
        onReactionSelect={(reaction) =>
          mutateAsync({
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

function PostInfo(post: Post) {
  return (
    <div className="flex justify-between p-1 mx-4">
      <div>
        <span className="text-xs text-gray-400">
          {post.reactionCount ?? 0} reactions
        </span>
      </div>
      <div>
        <span className="text-xs text-gray-400">
          {post.commentCount ?? 0} comments
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
        <PostInfo {...post} />
        <Separator />
        <PostActions
          onReactionSelect={async (reaction) => {
            await mutateAsync({
              postId: post.postId,
              reactionType: reaction,
            });
          }}
        />
      </div>
    </PostProvider>
  );
}
