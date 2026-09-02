import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./prisma/store.db"],
    "/api/*": ["./prisma/store.db"],
    "/admin/*": ["./prisma/store.db"],
    "/account/*": ["./prisma/store.db"],
  },
};

export default nextConfig;
