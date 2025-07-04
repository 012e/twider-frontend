import { signOut } from "next-auth/react";

export default function SignOut({ refreshToken }: { refreshToken: string }) {
  async function handleSignOut(token: string) {
    try {
      const response = await fetch("http://localhost:3000/api/auth/federated-sign-out", {
        headers: {
          refresh_token: token,
        },
      });
    } catch (error) {
      console.error("Error during sign out:", error);
    }

    await signOut();
  }
  return (
    <form action={() => handleSignOut(refreshToken)}>
      <button>Sign Out</button>
    </form>
  );
}
