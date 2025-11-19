import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-sans",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-sans-devanagari",
});

export const metadata: Metadata = {
  title: "Remotion Captioning Platform",
  description: "AI-powered video captioning with Hinglish support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSansDevanagari.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
