import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const socialImage = `${siteUrl}/media/thirsty-costa-brava-og.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thirsty Costa Brava | Festes i experiències",
    template: "%s | Thirsty",
  },
  description:
    "Thirsty Costa Brava: festes, dates, moments reals i experiències per viure amb la teva gent.",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "ca_ES",
    url: siteUrl,
    siteName: "Thirsty",
    title: "Thirsty Costa Brava — Festes i experiències",
    description:
      "Festes, records reals i experiències amb la teva gent.",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Ambient d'una festa Thirsty a la Costa Brava",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thirsty Costa Brava | Festes i experiències",
    description: "Festes, records reals i Thirsty Experiences.",
    images: [socialImage],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Thirsty",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07181f",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
