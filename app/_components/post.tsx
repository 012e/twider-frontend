import { GetPostByIdResponse as Post, posts, ProblemDetails } from "@/lib/api"; // Import Post type
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

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

export default function PostCard({ post }: PostCardProps) {
  const [bodyExtended, setBodyExtended] = useState(false);

  return (
    <Card
      key={post.postId}
      className="flex flex-col gap-3 p-4 rounded-2xl border shadow-sm bg-card text-card-foreground"
    >
      <div className="flex gap-3 items-center">
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
      <div className="mx-2">
        <CardTitle>{post.content}</CardTitle>
      </div>
      <CardFooter className="flex justify-between text-sm text-gray-600">
        <span>Reactions: {post.reactionCount}</span>
        <span>Comments: {post.commentCount}</span>
      </CardFooter>
    </Card>
  );
}
