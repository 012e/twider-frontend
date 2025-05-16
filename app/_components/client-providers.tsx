"use client";

import React, { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "../_components/nav-bar";
import { useDimensions } from "@/components/hooks/use-dimension";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const { width: navWidth } = useDimensions(navRef);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen w-screen">
            <NavBar ref={navRef} />
            <main style={{ marginLeft: navWidth }} className="w-full h-full">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
