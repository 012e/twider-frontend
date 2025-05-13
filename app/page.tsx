"use client";

import { Button } from "@/components/ui/button";
import { useSettingsStoreActions } from "@/lib/stores/user-settings";
import { useAuth } from "react-oidc-context";

export default function Home() {
  const auth = useAuth();
  const { setAccessToken } = useSettingsStoreActions();

  async function login() {
    await auth.signinRedirect();
  }

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return (
      <div>
        Oops... {auth.error.kind} caused {auth.error.message}
      </div>
    );
  }

  if (auth.isAuthenticated) {
    setAccessToken(auth.user?.access_token || "");
    console.log("User", auth.user);
    return (
      <div>
        Hello {auth.user?.profile.sub}{" "}
        <Button onClick={() => void auth.removeUser()}>Log out</Button>
      </div>
    );
  }

  return <Button onClick={login}>Login</Button>;
}
