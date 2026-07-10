import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const url = import.meta.env.PUBLIC_CONVEX_URL || "";
console.log("CONVEX URL IS:", url);
const convex = new ConvexReactClient(url);

export function withConvex<P extends object>(Component: React.ComponentType<P>) {
  return function ConvexWrapper(props: P) {
    return (
      <ConvexProvider client={convex}>
        <Component {...props} />
      </ConvexProvider>
    );
  };
}
