import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#0d1117",
};

export const metadata: Metadata = {
  title: "CashBlitz - Canada's #1 Cash Rewards Platform",
  description: "Canada's top rewards platform. Play games, complete tasks, and earn real Canadian dollars. Instant payouts via Interac e-Transfer, PayPal, and more.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CashBlitz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className="dark">
      <body className={`${inter.variable} antialiased bg-background`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
