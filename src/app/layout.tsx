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
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0d1117",
};

export const metadata: Metadata = {
  title: "CashBlitz - Earn Cash Playing Games",
  description: "Play games, complete tasks, and earn real cash rewards. The most exciting way to make money!",
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
