"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn("keycloak");
    } else if (status === "authenticated") {
      void router.push("/");
    } else {
      console.log("loading");
    }
  }, [status, router]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <h1 className="text-2xl tracking-tight">Loading</h1>
    </div>
  );
}
