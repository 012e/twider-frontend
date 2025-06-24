import { Post } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { PostProvider } from "./stores/post-provider";
import { PostHeader } from "./post-header";
import { PostContent } from "./post-content";
import { PostInfo } from "./post-info";
import { PostActions } from "./post-actions";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <PostProvider post={post} key={post.postId}>
      <div className="flex flex-col rounded-2xl border shadow-sm bg-card text-card-foreground">
        <PostHeader />
        <PostContent content={post.content ?? ""} />
        <PostInfo />
        <Separator />
        <PostActions />
      </div>
    </PostProvider>
  );
}
