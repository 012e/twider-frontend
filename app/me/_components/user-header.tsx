"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/api/schemas";
import { User as UserIcon } from "lucide-react";

interface UserPageHeaderProps {
  user: User;
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function UserPageHeader({ user }: UserPageHeaderProps) {
  const {
    image,
    username,
    name,
    bio,
    postsCount = 0,
    followersCount = 0,
    followingCount = 0,
  } = user;

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : username.charAt(0).toUpperCase();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:gap-8 p-4 bg-card text-card-foreground rounded-lg border">
      <div className="flex-shrink-0 mx-auto sm:mx-0">
        <Avatar className="h-28 w-28 border-2 border-primary">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback className="text-3xl">
            {initials || <UserIcon size={48} />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-center sm:text-left">
            {username}
          </h1>
          <div className="flex justify-center sm:justify-start gap-6 ml-0 sm:ml-auto">
            <StatItem label="Posts" value={postsCount} />
            <StatItem label="Followers" value={followersCount} />
            <StatItem label="Following" value={followingCount} />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <p className="font-semibold">{name}</p>
          {bio && <p className="text-muted-foreground mt-1">{bio}</p>}
        </div>
      </div>
    </header>
  );
}
