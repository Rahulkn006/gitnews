import { v } from "convex/values";
import { action, query } from "./_generated/server";

// Subscriptions are disabled while the Polar component is not installed.
// Re-enable this file when billing is required by reinstalling @convex-dev/polar
// and adding it back to convex.config.ts.

export const polar: any = null;

export const changeCurrentSubscription = action({
  args: {},
  handler: async () => {
    throw new Error("Subscriptions are not configured.");
  },
});

export const cancelCurrentSubscription = action({
  args: {},
  handler: async () => {
    throw new Error("Subscriptions are not configured.");
  },
});

export const listAllProducts = query({
  args: {},
  handler: async (): Promise<
    Array<{ recurringInterval: string; [key: string]: any }>
  > => {
    return [];
  },
});

export const generateCheckoutLink = action({
  args: { productIds: v.array(v.string()), origin: v.string() },
  handler: async (): Promise<{ url: string }> => {
    throw new Error("Checkout is not configured.");
  },
});

export const generateCustomerPortalUrl = action({
  args: {},
  handler: async () => {
    throw new Error("Customer portal is not configured.");
  },
});
