"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = typeof import.meta !== "undefined" && import.meta.env 
  ? import.meta.env.PUBLIC_CONVEX_URL 
  : process.env.PUBLIC_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl as string);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
