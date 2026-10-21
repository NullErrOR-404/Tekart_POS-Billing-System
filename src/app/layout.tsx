import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Tekart POS | Boutique Retail & Inventory",
  description:
    "Ultra-fast predictive billing, multi-attribute inventory, and customer loyalty management for Tekart.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F8FAFC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
