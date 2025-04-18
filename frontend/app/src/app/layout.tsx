import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Q&A Assistant - AI-powered answers",
  description: "Get answers to your questions with our AI-powered Q&A Assistant",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#2d2d2d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#2d2d2d] text-gray-200`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
