import { execSync } from "node:child_process";

const token = process.env.VERCEL_TOKEN;
if (!token) {
  console.error("Set VERCEL_TOKEN to a full Vercel account token.");
  process.exit(1);
}

console.log("Installing Neon integration and connecting to iqos project...");
execSync(
  "npx vercel integration add neon --name iqos-db -e production -e preview --non-interactive",
  {
    stdio: "inherit",
    env: { ...process.env, VERCEL_TOKEN: token },
  }
);

console.log("Pulling production DATABASE_URL from Vercel...");
execSync("npx vercel env pull .env.production.local --environment=production --yes", {
  stdio: "inherit",
  env: { ...process.env, VERCEL_TOKEN: token },
});

console.log("Provisioning schema and seed data on Neon...");
execSync("npx prisma db push", {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: readDatabaseUrlFromEnvFile(".env.production.local"),
  },
});
execSync("npx tsx prisma/seed.ts", {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: readDatabaseUrlFromEnvFile(".env.production.local"),
  },
});

console.log("Deploying production...");
execSync("npx vercel deploy --prod --yes", {
  stdio: "inherit",
  env: { ...process.env, VERCEL_TOKEN: token },
});

console.log("Neon Postgres is connected and deployed.");

function readDatabaseUrlFromEnvFile(path) {
  const fs = require("node:fs");
  const content = fs.readFileSync(path, "utf8");
  const keys = ["DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL"];
  for (const key of keys) {
    const match = content.match(new RegExp(`^${key}="(.+)"`, "m"));
    if (match) return match[1];
  }
  throw new Error(`No Postgres DATABASE_URL found in ${path}`);
}
