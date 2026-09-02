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
    default: "SMOKA | Rare & Limited Edition Products",
    template: "%s | SMOKA",
  },
  description:
    "Discover rare and limited-edition products selected for collectors who want something different. Rare • Limited • Exclusive",
  keywords: ["limited edition", "rare", "collector", "premium", "SMOKA"],
  icons: {
    icon: "/smoka-logo.jpg",
    apple: "/smoka-logo.jpg",
  },
  openGraph: {
    title: "SMOKA",
    description: "Rare • Limited • Exclusive",
    siteName: "SMOKA",
    type: "website",
    images: [{ url: "/smoka-logo.jpg", alt: "SMOKA" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
