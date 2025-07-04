"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { users, ProblemDetails } from "@/lib/api";
import { User, Post } from "@/lib/api/schemas";
import { AxiosError } from "axios";
import PostCard from "@/components/post/post";
import InfiniteScrollTrigger from "@/components/ui/infinite-scroll-trigger";
import { Loader, CalendarDays, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { getSession } from "next-auth/react";
import SignOutButton from "./_components/sign-out-button";

function LoadingState() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin size-10 text-primary" />
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
      <div className="p-8 text-center rounded-lg bg-destructive/10 text-destructive">
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

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
  });
  console.log("Session data:", session);

  // Mock data for demonstration
  const followerCount = 0;
  const followingCount = 0;

  return (
    <div className="border-b bg-card">
      <div className="h-48 bg-muted">{/* Placeholder for cover image */}</div>
      <div className="p-4 -mt-20 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end">
          <Avatar className="border-4 size-36 border-background">
            <AvatarImage src={user.profilePicture ?? undefined} />
            <AvatarFallback className="text-4xl">
              {user.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0">
            {session && <SignOutButton refreshToken={(session as any).refresh_token} />}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {user.verificationStatus === "VERIFIED" && (
              <CheckCircle className="fill-current size-5 text-primary" />
            )}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
        <p className="mt-4 text-foreground/90">{user.bio}</p>
        <div className="flex gap-4 items-center mt-4 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <span>Joined {joinDate}</span>
        </div>
        <div className="flex gap-6 items-center mt-4">
          <div className="flex gap-1 items-center">
            <span className="font-bold text-foreground">{postCount}</span>
            <span className="text-muted-foreground">Posts</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="font-bold text-foreground">
              {followerCount.toLocaleString()}
            </span>
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="font-bold text-foreground">
              {followingCount.toLocaleString()}
            </span>
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
        <TabsList className="justify-around w-full rounded-none border-b">
          <TabsTrigger value="posts" className="flex-1">
            Posts
          </TabsTrigger>
          <TabsTrigger value="replies" className="flex-1" disabled>
            Replies
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1" disabled>
            Media
          </TabsTrigger>
          <TabsTrigger value="likes" className="flex-1" disabled>
            Likes
          </TabsTrigger>
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
            <div className="p-10 text-center text-muted-foreground">
              <h3 className="text-xl font-semibold">No posts yet</h3>
              <p>When this user posts, their posts will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
