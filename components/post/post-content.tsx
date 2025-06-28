import PostCarousel from "./post-carousel";
import { usePostContext } from "./stores/post-provider";

export function PostContent() {
  const content = usePostContext((state) => state.content);
  const mediaUrls = usePostContext((state) => state.mediaUrls);
  return (
    <div className="w-full h-full">
      <div className="my-1 mx-3">
        <div className="flex gap-3 items-center"></div>
        <div className="mx-2">
          <p>{content}</p>
        </div>
      </div>
      {mediaUrls && mediaUrls.length > 0 && <PostCarousel images={mediaUrls} />}
    </div>
  );
}
