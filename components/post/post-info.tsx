import { PostCommentDialog } from "./post-actions";
import { usePostContext } from "./stores/post-provider";

export function PostInfo() {
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
        <PostCommentDialog>
          <span className="text-xs text-gray-400 hover:underline hover:cursor-pointer">
            {commentCount ?? 0} comments
          </span>
        </PostCommentDialog>
      </div>
    </div>
  );
}

