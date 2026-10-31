import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://manjitrana.com.np"),
  title: { default: "ManjitRana Global News — Independent Journalism", template: "%s | ManjitRana Global News" },
  description: "Independent global news coverage, verified sources and clear perspectives from around the world.",
  openGraph: { type: "website", siteName: "ManjitRana Global News", title: "ManjitRana Global News", description: "Independent global news coverage." },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? <Script async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`} crossOrigin="anonymous" /> : null}{children}</body></html>;
}
