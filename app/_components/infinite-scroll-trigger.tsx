import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

// Component handling the Intersection Observer and "Load More" indicator
interface InfiniteScrollTriggerProps {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  // Optionally pass a count of items to decide when to show "Nothing more to load"
  itemCount: number;
}

export default function InfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  itemCount,
}: InfiniteScrollTriggerProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]); // Dependencies

  return (
    <div ref={loadMoreRef} className="flex justify-center mt-4">
      {isFetchingNextPage && (
        <Button disabled className="w-full">
          Loading more...
        </Button>
      )}
      {!hasNextPage && !isFetchingNextPage && itemCount > 0 && (
        <div className="text-center text-gray-500">Nothing more to load</div>
      )}
      {/* Optional: Show initial fetching state if needed */}
      {/* This might be handled by the parent, but included for completeness */}
      {/* {isFetching && !isFetchingNextPage && <div className="text-center">Fetching initial posts...</div>} */}
    </div>
  );
}

