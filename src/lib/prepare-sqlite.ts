import fs from "fs";
import path from "path";

export function prepareSqliteDatabaseUrl(configured: string): string {
  if (!process.env.VERCEL || !configured.includes("/tmp/")) {
    return configured;
  }

  const tmpPath = "/tmp/store.db";
  if (!fs.existsSync(tmpPath)) {
    const bundledPaths = [
      path.join(process.cwd(), "prisma", "store.db"),
      path.join(process.cwd(), "prisma", "dev.db"),
    ];

    for (const bundled of bundledPaths) {
      if (fs.existsSync(bundled)) {
        fs.copyFileSync(bundled, tmpPath);
        break;
      }
    }
  }

  return `file:${tmpPath}`;
}
