import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwasthyaKhoj",
  description:
    "স্বাস্থ্য এখন আপনার হাতের মুঠোয় — গ্রামীণ অঞ্চলের জন্য একটি সহজ স্বাস্থ্যসেবা খোঁজ ও বুকিং অ্যাপ।",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
    other: [
      {
        rel: "apple-touch-icon",
        url: "/icon.png",
      },
      {
        rel: "icon",
        url: "/icon.png",
      },
      {
        rel: "shortcut icon",
        url: "/icon.png",
      },
    ],
  },
  keywords: [
    "SwasthyaKhoj",
    "healthcare app",
    "rural health",
    "doctor booking",
    "hospital finder",
    "medical store locator",
    "West Bengal healthcare",
    "India rural health",
    "স্বাস্থ্য অ্যাপ",
    "গ্রামীণ স্বাস্থ্য",
    "স্বাস্থ্য খোঁজ",
    "রোগী বুকিং অ্যাপ",
  ],
  metadataBase: new URL("https://swasthya-khoj-ui.vercel.app"), // Change to your actual domain
  openGraph: {
    title: "SwasthyaKhoj",
    description:
      "Find nearby hospitals, doctors, and medical stores in rural India. স্বাস্থ্য এখন আপনার হাতের মুঠোয়!",
    url: "https://swasthya-khoj-ui.vercel.app",
    siteName: "SwasthyaKhoj",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://swasthya-khoj-ui.vercel.app/og-image.png", // Replace with actual image URL
        width: 1200,
        height: 630,
        alt: "SwasthyaKhoj - Healthcare at your fingertips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwasthyaKhoj",
    description:
      "Find hospitals, doctors & stores near you. স্বাস্থ্য এখন আপনার হাতের মুঠোয়!",
    creator: "@shovan04", // Optional: your Twitter handle
    images: ["https://swasthya-khoj-ui.vercel.app/icon.png"], // Replace with actual image URL
  },
  authors: [{ name: "Shovan Mondal", url: "https://github.com/shovan04" }],
  creator: "Shovan Mondal",
  publisher: "SwasthyaKhoj Team",
  alternates: {
    canonical: "https://swasthya-khoj-ui.vercel.app/",
  },
  themeColor: "#E0F7FA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
