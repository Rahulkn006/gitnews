import { internalAction } from "./_generated/server";

// Polar subscription seeding is disabled while the Polar component is not installed.
export default internalAction(async () => {
  console.info("🏃‍♂️ Skipping Polar products creation and seeding.");
});
