"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { users, ProblemDetails } from "@/lib/api";
import { User, Post } from "@/lib/api/schemas";
import { AxiosError } from "axios";
import PostCard from "@/components/post/post";
import InfiniteScrollTrigger from "@/components/ui/infinite-scroll-trigger";
import { Loader, CalendarDays, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

function LoadingState() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="size-10 animate-spin text-primary" />
    </div>
  );
}

interface ErrorStateProps {
  error: AxiosError<ProblemDetails> | Error;
  context: string;
}

function ErrorState({ error, context }: ErrorStateProps) {
  const errorMessage =
    (error as AxiosError<ProblemDetails>)?.response?.data?.detail ||
    error.message ||
    "An unknown error occurred.";

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg">
        <h2 className="text-lg font-semibold">Error Loading {context}</h2>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}

interface UserProfileHeaderProps {
  user: User;
  postCount: number;
}

function UserProfileHeader({ user, postCount }: UserProfileHeaderProps) {
  const joinDate = user.createdAt
    ? format(new Date(user.createdAt), "MMMM yyyy")
    : "N/A";

  // Mock data for demonstration
  const followerCount = 1234;
  const followingCount = 567;

  return (
    <div className="border-b bg-card">
      <div className="h-48 bg-muted">
        {/* Placeholder for cover image */}
      </div>
      <div className="p-4 sm:p-6 -mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <Avatar className="size-36 border-4 border-background">
            <AvatarImage src={user.profilePicture ?? undefined} />
            <AvatarFallback className="text-4xl">
              {user.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0">
            <Button variant="outline">Edit profile</Button>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {user.verificationStatus === "VERIFIED" && (
              <CheckCircle className="size-5 text-primary fill-current" />
            )}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
        <p className="mt-4 text-foreground/90">{user.bio}</p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <span>Joined {joinDate}</span>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-1">
            <span className="font-bold text-foreground">{postCount}</span>
            <span className="text-muted-foreground">Posts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-foreground">{followerCount.toLocaleString()}</span>
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-foreground">{followingCount.toLocaleString()}</span>
            <span className="text-muted-foreground">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const {
    data: user,
    error: loadUserError,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => users.getCurrent(),
  });

  const {
    data: userPosts,
    error: loadPostsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
  } = useInfiniteQuery({
    queryKey: ["userPosts", user?.userId],
    enabled: !!user,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      users.getPosts(user!.userId, { cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : null,
  });

  if (isLoadingUser || (!!user && isLoadingPosts && !userPosts)) {
    return <LoadingState />;
  }

  if (loadUserError) {
    return <ErrorState error={loadUserError} context="User Data" />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        User not found.
      </div>
    );
  }

  const allPosts = userPosts?.pages.flatMap((page) => page.items || []) ?? [];

  return (
    <div className="container mx-auto w-1/2">
      <UserProfileHeader user={user} postCount={allPosts.length} />
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-around rounded-none border-b">
          <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
          <TabsTrigger value="replies" className="flex-1" disabled>Replies</TabsTrigger>
          <TabsTrigger value="media" className="flex-1" disabled>Media</TabsTrigger>
          <TabsTrigger value="likes" className="flex-1" disabled>Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {loadPostsError && (
            <div className="p-4">
              <ErrorState error={loadPostsError} context="Posts" />
            </div>
          )}

          <div className="flex flex-col gap-5 py-5">
            {allPosts.map(
              (post) => !!post && <PostCard key={post.postId} post={post} />,
            )}
          </div>
          
          {(allPosts.length > 0 || hasNextPage) && (
            <InfiniteScrollTrigger
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              itemCount={allPosts.length}
            />
          )}

          {!isLoadingPosts && !loadPostsError && allPosts.length === 0 && (
            <div className="text-center p-10 text-muted-foreground">
                <h3 className="text-xl font-semibold">No posts yet</h3>
                <p>When this user posts, their posts will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
