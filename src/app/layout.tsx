import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Thirsty Experiences - Viatge de final de curs",
  description:
    "Troba el grup de WhatsApp del teu institut i comença a organitzar el viatge de final de curs a Menorca amb els teus amics.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ca_ES",
    url: "/",
    title: "Thirsty Experiences — Viatge de final de curs a Menorca",
    description:
      "Troba el grup de WhatsApp del teu institut per al vostre viatge a Menorca.",
    images: [
      {
        url: "/media/thirsty-experiences-menorca-og.webp",
        width: 1200,
        height: 630,
        alt: "Cala de Menorca durant un viatge de final de curs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viatge de final de curs a Menorca | Thirsty Experiences",
    description: "Troba el grup de WhatsApp del teu institut per al vostre viatge a Menorca.",
    images: ["/media/thirsty-experiences-menorca-og.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4ff36",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
