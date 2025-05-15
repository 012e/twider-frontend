"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  AuthProvider,
  AuthProviderProps,
  useAutoSignin,
} from "react-oidc-context";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "./_components/nav-bar";
import React, { useRef } from "react";
import { useDimensions } from "@/components/hooks/use-dimension";
import { WebStorageStateStore } from "oidc-client-ts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

const oidcConfig: AuthProviderProps = {
  authority: "http://localhost:6969/realms/master",
  client_id: "twider",
  redirect_uri: "http://localhost:3000",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}

function EnsureAuthenticated({ children }: { children: React.ReactNode }) {
  useAutoSignin({ signinMethod: "signinRedirect" });

  return children;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navRef = useRef<HTMLDivElement>(null);
  const { width: navWidth } = useDimensions(navRef);

  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <EnsureAuthenticated>
              <NavBar ref={navRef} />
              <main style={{ marginLeft: navWidth }}>{children}</main>
            </EnsureAuthenticated>
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
