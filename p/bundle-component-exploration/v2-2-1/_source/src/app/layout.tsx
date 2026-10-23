import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StaticProductApi } from "@/components/StaticProductApi";
import { MealDetailProvider } from "@/providers/MealDetailProvider";

// Same font setup as every-website src/app/layout.tsx — files are supplied locally (see public/fonts/README.md).
const diatype = localFont({
  src: [
    { path: "../../public/fonts/ABCDiatype-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/ABCDiatype-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/ABCDiatype-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-diatype",
});

const marist = localFont({
  src: [
    { path: "../../public/fonts/ABCMarist-Book.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Marist-Book-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-marist",
});

export const metadata: Metadata = {
  title: "Every prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-clip">
      <body className={`${diatype.variable} ${marist.variable} antialiased overflow-x-clip`}>
        <StaticProductApi />
        <MealDetailProvider>{children}</MealDetailProvider>
      </body>
    </html>
  );
}
