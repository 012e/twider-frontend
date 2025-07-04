"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { posts, ProblemDetails } from "@/lib/api";
import { AxiosError } from "axios";
import PostCard from "@/components/post/post";
import InfiniteScrollTrigger from "@/components/ui/infinite-scroll-trigger";
import PostForm from "@/components/post-form/post-form";
import { Loader } from "lucide-react";
import { PostFormProvider } from "@/components/post-form/stores/post-form-provider";

function LoadingState() {
  return (
    <div className="flex justify-center items-center h-screen text-xl animate-spin">
      <Loader />
    </div>
  );
}

// Component to display an error message
interface ErrorStateProps {
  error: AxiosError<ProblemDetails> | Error;
}

function ErrorState({ error }: ErrorStateProps) {
  // Safely access the error detail
  const errorMessage =
    (error as AxiosError<ProblemDetails>)?.response?.data?.detail ||
    error.message ||
    "An unknown error occurred.";

  return (
    <div className="p-4 text-center text-red-500">
      Error loading posts: {errorMessage}
    </div>
  );
}

function PostFormWrapper() {
  return (
    <PostFormProvider initialContent="">
      <PostForm />
    </PostFormProvider>
  );
}

export default function HomePage() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching, // Keep isFetching for initial state handling
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return posts.getList({ cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage, _allPages): string | null => {
      return lastPage.hasMore ? lastPage.nextCursor : null;
    },
  });

  // Handle loading and error states at the top level
  if (status === "pending") {
    return <LoadingState />;
  }

  if (status === "error") {
    return <ErrorState error={error} />;
  }

  // Flatten the pages data for rendering
  const allPosts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="p-4 mx-auto space-y-6 max-w-2xl">
      <main>
        <PostFormWrapper />
        <h1 className="m-5 text-3xl font-bold tracking-tight text-center">
          Latest Posts
        </h1>

        <div className="flex flex-col gap-5">
          {allPosts.map(
            (post) => !!post && <PostCard key={post.postId} post={post} />,
          )}
        </div>

        {/* Render the infinite scroll trigger and loading/end state */}
        {/* Only render if there are posts or potentially more posts to fetch */}
        {(allPosts.length > 0 || hasNextPage) && (
          <InfiniteScrollTrigger
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            itemCount={allPosts.length} // Pass item count to decide "Nothing more to load"
          />
        )}
      </main>
    </div>
  );
}
