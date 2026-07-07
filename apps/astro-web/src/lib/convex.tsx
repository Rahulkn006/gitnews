import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

const convexUrl = import.meta.env.PUBLIC_CONVEX_URL || "https://fake-url.convex.cloud";
export const convexClient = new ConvexReactClient(convexUrl);

export function withConvex<P extends object>(Component: React.ComponentType<P>) {
  return function ConvexWrapper(props: P) {
    return (
      <ConvexProvider client={convexClient}>
        <Component {...props} />
      </ConvexProvider>
    );
  };
}
