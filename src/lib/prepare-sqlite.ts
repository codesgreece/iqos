import fs from "fs";
import os from "os";
import path from "path";

export function prepareSqliteDatabaseUrl(configured: string): string {
  if (!process.env.VERCEL) {
    return configured;
  }

  const tmpPath = path.join(os.tmpdir(), "iqos-store.db");
  const bundled = path.join(process.cwd(), "prisma", "store.db");

  if (!fs.existsSync(tmpPath) && fs.existsSync(bundled)) {
    fs.copyFileSync(bundled, tmpPath);
  }

  return `file:${tmpPath}`;
}
