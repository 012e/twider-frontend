"use client";

import { Input } from "@/components/ui/input";
import { Search, Loader } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebounce } from "@uidotdev/usehooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { search, ProblemDetails } from "@/lib/api";
import { AxiosError } from "axios";
import PostCard from "@/components/post/post";
import InfiniteScrollTrigger from "@/components/ui/infinite-scroll-trigger";

function LoadingState() {
  return (
    <div className="flex justify-center items-center py-12 text-xl animate-spin">
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
      Error searching posts: {errorMessage}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Search className="mx-auto mb-4 w-12 h-12 opacity-50" />
        <p className="text-lg">Search for posts</p>
        <p className="text-sm">Enter a search term to find relevant posts</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-muted-foreground">
      <Search className="mx-auto mb-4 w-12 h-12 opacity-50" />
      <p className="text-lg">No results found</p>
      <p className="text-sm">Try searching for something else</p>
    </div>
  );
}

export default function Page() {
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
    shallow: false,
    throttleMs: 1000,
  });

  const debouncedQuery = useDebounce(query, 1000);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["search", "posts", debouncedQuery, "cursor"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return search.posts(debouncedQuery, { cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage, _allPages): string | null => {
      return lastPage.hasMore ? lastPage.nextCursor : null;
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  // Flatten the pages data for rendering
  const allPosts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div>
      {/* Search Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 px-4 mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4 mx-auto space-y-6 max-w-2xl">
        {!debouncedQuery.trim() ? (
          <EmptyState query={debouncedQuery} />
        ) : status === "pending" && isFetching ? (
          <LoadingState />
        ) : status === "error" ? (
          <ErrorState error={error} />
        ) : allPosts.length === 0 ? (
          <EmptyState query={debouncedQuery} />
        ) : (
          <>
            <div className="flex flex-col gap-5">
              {allPosts.map(
                (post) => !!post && <PostCard key={post.postId} post={post} />,
              )}
            </div>

            {/* Infinite scroll trigger */}
            <InfiniteScrollTrigger
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              itemCount={allPosts.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
