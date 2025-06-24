import { Post } from "@/lib/api";

export function PostContent({ content }: { content: string }) {
  return (
    <div className="my-1 mx-3">
      <div className="flex gap-3 items-center"></div>
      <div className="mx-2">
        <p>{content}</p>
      </div>
    </div>
  );
}