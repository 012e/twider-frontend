import { GetPostByIdResponse as Post, posts, ProblemDetails } from "@/lib/api"; // Import Post type
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card key={post.postId}>
      <CardHeader>
        <CardTitle>{post.content}</CardTitle>
        <CardDescription>by {post.user.username}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Created At: {new Date(post.createdAt).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-600">
        <span>Reactions: {post.reactionCount}</span>
        <span>Comments: {post.commentCount}</span>
      </CardFooter>
    </Card>
  );
}
