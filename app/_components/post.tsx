import { GetPostByIdResponse as Post, posts, ProblemDetails } from "@/lib/api"; // Import Post type
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Share, User } from "lucide-react";
import ReactionButton from "./reaction-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

function PostHeader(post: Post) {
  return (
    <div className="flex gap-3 items-center m-3">
      <Link href={`/user/${post.user.userId}`}>
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={post.user.profilePicture as string | undefined}
            alt="User"
          />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </Link>

      <Link
        className="flex flex-col justify-center"
        href={`/user/${post.user.userId}`}
      >
        <CardTitle className="hover:underline">
          <p>{post.user.username}</p>
        </CardTitle>
        <CardDescription className="hover:underline">
          {formatTime(new Date(post.createdAt))}
        </CardDescription>
      </Link>
    </div>
  );
}

function PostActions(post: Post) {
  return (
    <div className="grid grid-cols-3 m-1 text-gray-600">
      <ReactionButton className="flex justify-center items-center w-full h-full" />
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
    <div className="mx-3 my-1">
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
    <div
      key={post.postId}
      className="flex flex-col rounded-2xl border shadow-sm bg-card text-card-foreground"
    >
      <PostHeader {...post} />
      <PostContent {...post} />
      <PostInfo {...post} />
      <Separator />
      <PostActions {...post} />
    </div>
  );
}
