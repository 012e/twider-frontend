"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/api/schemas";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { useRouter } from "next/navigation";

function UserCardSkeleton() {
  return (
    <div className="w-96">
      <CardHeader className="flex flex-row gap-4 items-start space-y-0">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-24 h-3" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-20 h-8" />
      </CardFooter>
    </div>
  );
}

function InternalUserCard({ user }: { user: User }) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const router = useRouter();

  return (
    // the hover card already have card styles
    <div className="z-50 w-96">
      <CardHeader className="flex flex-row gap-4 items-start space-y-0">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={user.profilePicture ?? ""}
            alt={user.username ?? ""}
          />
          <AvatarFallback>
            {user.username ? getInitials(user.username) : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle>{user.username ?? "N/A"}</CardTitle>
          <CardDescription>{user.email ?? "N/A"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {user.bio ?? "No bio available."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge
          variant={
            user.verificationStatus === "VERIFIED" ? "default" : "secondary"
          }
        >
          {user.verificationStatus ?? "UNKNOWN"}
        </Badge>
        <Button
          variant="outline"
          onClick={() => router.push(`/user/${user.userId}`)}
        >
          View Profile
        </Button>
      </CardFooter>
    </div>
  );
}

export default function UserCard({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.users.getById(userId),
  });

  if (isLoading) {
    return <UserCardSkeleton />;
  }

  if (error) {
    return (
      <Card className="w-96 bg-destructive">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was an error loading the user profile.</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-96">
        <CardHeader>
          <CardTitle>User Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested user could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return <InternalUserCard user={user} />;
}
