"use client";

import { useEffect } from "react";

declare global {
  interface Window { adsbygoogle?: Array<Record<string, unknown>>; }
}

type AdUnitProps = { slot?: string; format?: "auto" | "fluid" | "rectangle" };

export default function AdUnit({ slot = "", format = "auto" }: AdUnitProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // The browser may block ads or AdSense may not be ready.
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside className="adPlacement" aria-label="Advertisement">
      <span className="adLabel">ADVERTISEMENT</span>
      <ins className="adsbygoogle"
        style={{ display: "block", minHeight: format === "rectangle" ? 250 : 90 }}
        data-ad-client={client} data-ad-slot={slot}
        data-ad-format={format} data-full-width-responsive="true" />
    </aside>
  );
}
