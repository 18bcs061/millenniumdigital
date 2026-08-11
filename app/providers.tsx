"use client";

import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { StoreHydration } from "@/components/StoreHydration";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <StoreHydration />
      {children}
    </SessionProvider>
  );
}
