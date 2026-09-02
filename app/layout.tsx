import type { Metadata } from "next";
import { Crimson_Text, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const siteTitle = "Uluslararası Türbeler Sempozyumu";
const siteDescription =
  "1-3 Nisan 2027 tarihinde İstanbul'da düzenlenecek Uluslararası Türbeler Sempozyumu için tanıtım ve bildiri başvuru sitesi.";

function parseSiteUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname ? parsedUrl : null;
  } catch {
    return null;
  }
}

const siteUrl =
  parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  parseSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  parseSiteUrl(process.env.VERCEL_URL) ??
  new URL("http://localhost:3000");

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: siteUrl,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${crimson.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
