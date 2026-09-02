import { PrismaClient } from "@prisma/client";
import { prepareSqliteDatabaseUrl } from "./prepare-sqlite";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = prepareSqliteDatabaseUrl(
  process.env.DATABASE_URL ?? "file:./dev.db"
);
process.env.DATABASE_URL = databaseUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
