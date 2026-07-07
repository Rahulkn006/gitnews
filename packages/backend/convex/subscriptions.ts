// Subscriptions are disabled while the Polar component is not installed.
// Re-enable this file when billing is required by reinstalling @convex-dev/polar
// and adding it back to convex.config.ts.

export const polar: any = null;

export const changeCurrentSubscription = async () => {
  throw new Error("Subscriptions are not configured.");
};

export const cancelCurrentSubscription = async () => {
  throw new Error("Subscriptions are not configured.");
};

export const listAllProducts = async () => {
  return [];
};

export const generateCheckoutLink = async () => {
  throw new Error("Checkout is not configured.");
};

export const generateCustomerPortalUrl = async () => {
  throw new Error("Customer portal is not configured.");
};
