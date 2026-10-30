import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://manjitrana.com.np"),
  title: { default: "ManjitRana Global News — Independent Journalism", template: "%s | ManjitRana Global News" },
  description: "Independent global news coverage, verified sources and clear perspectives from around the world.",
  openGraph: { type: "website", siteName: "ManjitRana Global News", title: "ManjitRana Global News", description: "Independent global news coverage." },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
