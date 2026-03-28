import { seedForum } from "./forum";

async function main() {
  console.log("[seed] Starting seed...");
  await seedForum();
  console.log("[seed] Done.");
  process.exit(0);
}

main().catch(err => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
