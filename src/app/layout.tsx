import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FINAL BOSS ACTIVITY | Rare & Limited Edition Products",
    template: "%s | FINAL BOSS ACTIVITY",
  },
  description:
    "Discover rare and limited-edition products selected for collectors who want something different. Rare. Limited. Unforgettable.",
  keywords: ["limited edition", "rare", "collector", "premium", "FINAL BOSS ACTIVITY"],
  openGraph: {
    title: "FINAL BOSS ACTIVITY",
    description: "Rare. Limited. Unforgettable.",
    siteName: "FINAL BOSS ACTIVITY",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
