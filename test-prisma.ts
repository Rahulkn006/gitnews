import prisma from "./apps/backend/src/database/prisma";
async function run() {
  const all = await prisma.repository.findMany();
  console.log("All repos:");
  for (const r of all) {
    console.log(`${r.owner}/${r.name}`);
  }
}
run();
