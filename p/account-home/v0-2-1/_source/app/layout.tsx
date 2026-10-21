import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell";

const diatype = localFont({
  variable: "--font-diatype",
  display: "swap",
  src: [
    { path: "./fonts/ABCDiatype-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ABCDiatype-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/ABCDiatype-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ABCDiatype-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const marist = localFont({
  variable: "--font-marist",
  display: "swap",
  src: [
    { path: "./fonts/ABCMarist-Book.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ABCMarist-BookItalic.woff2", weight: "400", style: "italic" },
  ],
});

/** Quiz and plan reveal headlines (Figma "Website" onboarding quiz uses Newsreader). */
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], weight: ["400"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Every Account Home · Eve prototype", template: "%s · Every account" },
  description: "Prototype of the Every account home with Eve, the AI food companion. Mock data only.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${diatype.variable} ${marist.variable} ${newsreader.variable}`}>
      <body className="font-sans min-h-dvh"><Shell>{children}</Shell></body>
    </html>
  );
}
