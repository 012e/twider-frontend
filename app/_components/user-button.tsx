import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useAuth } from "react-oidc-context";

export default function UserButton() {
  const { user } = useAuth();
  if (!user) {
    return <></>;
  }
  return (
    <Button variant="ghost" size="icon" className="!size-7">
      <Avatar>
        <AvatarImage />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
    </Button>
  );
}
