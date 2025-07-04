import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import axios, { AxiosError } from "axios";

const AUTH_KEYCLOAK_ISSUER = process.env.AUTH_KEYCLOAK_ISSUER;
const AUTH_KEYCLOAK_ID = process.env.AUTH_KEYCLOAK_ID;
const AUTH_KEYCLOAK_SECRET = process.env.AUTH_KEYCLOAK_SECRET;
const tokenEndPoint = `${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

export type KeycloakJwt = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token: rawToken, account }) {
      const token = rawToken as KeycloakJwt;
      if (account) {
        console.log(account)
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < token.expires_in * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError("Missing refresh_token");

        try {
          const response = await fetch(tokenEndPoint, {
            method: "POST",
            body: new URLSearchParams({
              client_id: AUTH_KEYCLOAK_ID!,
              client_secret: AUTH_KEYCLOAK_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          return {
            ...token,
            access_token: newTokens.access_token,
            expires_in: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            // Some providers only issue refresh tokens once, so preserve if we did not get a new one
            refresh_token: newTokens.refresh_token
              ? newTokens.refresh_token
              : token.refresh_token,
          };
        } catch (error) {
          // If we fail to refresh the token, return an error so we can handle it on the page
          rawToken.error = "RefreshTokenError";
          console.error("Error refreshing token", error);
          return null;
        }
      }
    },
    async session({ session, token }) {
      const res = {
        ...session,
        error: token.error,
        token: token.access_token,
        refresh_token: token.refresh_token,
      };
      return res;
    },
  },
});

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
  }
}
