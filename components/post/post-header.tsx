import { usePostContext } from "./stores/post-provider";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import UserCard from "../ui/user-card";

function formatTime(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} at ${hours}:${minutes}`;
}

export function PostHeader() {
  const user = usePostContext((state) => state.user);
  const createdAt = usePostContext((state) => state.createdAt);

  return (
    <div className="flex gap-3 items-center m-3">
      <HoverCard openDelay={400} closeDelay={1000}>
        <HoverCardTrigger asChild>
          <Link href={`/user/${user.userId}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user.profilePicture ?? undefined}
                alt={user.username ?? "User avatar"}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="z-50 w-auto" side="top" align="start">
          <UserCard userId={user.userId} />
        </HoverCardContent>
      </HoverCard>

      <Link
        className="flex flex-col justify-center"
        href={`/user/${user.userId}`}
      >
        <CardTitle className="hover:underline">
          <p>{user.username}</p>
        </CardTitle>
        <CardDescription className="hover:underline">
          {formatTime(new Date(createdAt))}
        </CardDescription>
      </Link>
    </div>
  );
}
