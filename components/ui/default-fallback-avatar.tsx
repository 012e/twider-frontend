import { User } from "lucide-react";
import { AvatarFallback, AvatarImage } from "./avatar";

export default function DefaultFallbackAvatar({
  className,
}: {
  className?: string;
}) {
  return (
    <AvatarFallback className={className}>
      <User />
    </AvatarFallback>
  );
}
