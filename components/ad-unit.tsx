"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdUnitProps = { slot: string; format?: "auto" | "fluid" | "rectangle" };

export default function AdUnit({ slot, format = "auto" }: AdUnitProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client || !slot) return null;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense may not be ready yet or may be blocked by the visitor's browser.
    }
  }, []);

  return (
    <aside className="adPlacement" aria-label="Advertisement">
      <span className="adLabel">ADVERTISEMENT</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: format === "rectangle" ? 250 : 90 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
