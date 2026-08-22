import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://manjitrana.com.np"),
  title: "Manjit Rana — Web Developer & Digital Builder",
  description: "Portfolio of Manjit Rana, a BIT student and web developer from Nepal building purposeful digital products.",
  openGraph: { title: "Manjit Rana — Web Developer & Digital Builder", description: "Purposeful web products, built in Nepal.", url: "https://manjitrana.com.np", siteName: "Manjit Rana Portfolio", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Manjit Rana — Web Developer & Digital Builder" }] },
  twitter: { card: "summary_large_image", title: "Manjit Rana — Web Developer & Digital Builder", description: "Purposeful web products, built in Nepal.", images: ["/og.png"] },
  icons: {
    icon: [{ url: "/manjit-logo.jpeg", type: "image/jpeg" }],
    shortcut: "/manjit-logo.jpeg",
    apple: "/manjit-logo.jpeg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <head>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1003308976649733"
        crossOrigin="anonymous"
      />
    </head>
    <body>{children}</body>
  </html>;
}
