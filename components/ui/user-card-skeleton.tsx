import { Skeleton } from "./skeleton";

export function UserCardSkeleton() {
  return (
    <div className="bg-yellow-500">
      <div className="flex justify-end">
        <Skeleton className="w-5 h-5 bg-gray-700 rounded-full" />
      </div>
      <div className="flex items-center mt-2 space-x-4">
        <Skeleton className="w-20 h-20 bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-6 bg-gray-700" />
          <Skeleton className="w-5/6 h-4 bg-gray-700" />
          <Skeleton className="w-2/3 h-4 bg-gray-700" />
        </div>
      </div>
      <div className="flex mt-6 space-x-2">
        <Skeleton className="flex-1 h-10 bg-gray-700 rounded-md" />
        <Skeleton className="flex-1 h-10 bg-gray-700 rounded-md" />
        <Skeleton className="w-10 h-10 bg-gray-700 rounded-md" />
      </div>
    </div>
  );
}
