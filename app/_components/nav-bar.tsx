"use client";

import { Ref } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/components/hooks/use-mobile";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  Instagram,
  Compass,
  Film,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { signIn } from "next-auth/react";

export default function NavBar({ ref }: { ref: Ref<HTMLDivElement> }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Had to use !size-8 because https://github.com/shadcn-ui/ui/issues/6316
  const navItems = [
    { icon: <Home className="!size-8" />, label: "Home", href: "#" },
    { icon: <Search className="!size-8" />, label: "Search", href: "#" },
    { icon: <Compass className="!size-8" />, label: "Explore", href: "#" },
    { icon: <Film className="!size-8" />, label: "Reels", href: "#" },
    { icon: <PlusSquare className="!size-8" />, label: "Create", href: "#" },
    {
      icon: <Heart className="!size-8" />,
      label: "Notifications",
      href: "#",
    },
    { icon: <User className="!size-8" />, label: "Profile", href: "#" },
  ];

  if (isMobile) {
    return (
      <nav
        className="fixed bottom-0 left-0 z-50 m-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        ref={ref}
      >
        <div className="flex justify-around items-center px-4 h-16">
          {navItems.slice(0, 5).map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              asChild
              className="w-full h-full"
            >
              <Link href={item.href}>
                {item.icon}
                <span className="sr-only">{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </nav>
    );
  }
  return (
    <aside
      className="flex fixed top-0 left-0 z-50 flex-col items-center pt-4 h-screen border-r bg-background"
      ref={ref}
    >
      <div className="flex justify-center items-center px-4 mb-8">
        <div className="flex justify-center items-center lg:justify-start">
          <Button variant="ghost" size="icon" asChild>
            <Link
              href="/"
              className="flex gap-4 justify-center items-center p-8"
            >
              <Instagram className="size-7" />
            </Link>
          </Button>
        </div>
      </div>

      <nav className="flex flex-col gap-3 items-center mx-4">
        {navItems.map((item, index) => (
          <Button key={index} variant="ghost" size="icon" asChild>
            <Link
              href={item.href}
              className="flex gap-4 justify-center items-center p-8"
            >
              {item.icon}
            </Link>
          </Button>
        ))}
        <Button
          onClick={() => {
            signIn("keycloak");
          }}
          variant="ghost"
          size="icon"
        >
          <LogIn />
        </Button>
      </nav>

      <div className="px-2 mt-auto mb-6">
        <ModeToggle />
      </div>
    </aside>
  );
}
