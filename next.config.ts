import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./prisma/store.db", "./prisma/dev.db"],
    "/api/*": ["./prisma/store.db", "./prisma/dev.db"],
  },
};

export default nextConfig;
