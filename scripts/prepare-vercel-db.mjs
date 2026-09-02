import { execSync } from "node:child_process";
import fs from "node:fs";

const storePath = "prisma/store.db";

function seedStoreDb() {
  process.env.DATABASE_URL = `file:./${storePath}`;
  execSync("npx prisma db push", { stdio: "inherit", env: process.env });
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env });
}

if (process.env.VERCEL === "1") {
  seedStoreDb();
} else if (fs.existsSync("prisma/dev.db")) {
  fs.copyFileSync("prisma/dev.db", storePath);
} else if (!fs.existsSync(storePath)) {
  seedStoreDb();
}
