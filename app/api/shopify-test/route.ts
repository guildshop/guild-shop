import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

// Temporary diagnostic route to confirm the Shopify connection works on
// the live deployment. Safe to remove once verified.
export async function GET() {
  try {
    const data = await shopifyFetch<{ shop: { name: string; primaryDomain: { url: string } } }>(
      `{ shop { name primaryDomain { url } } }`
    );
    return NextResponse.json({ ok: true, shop: data.shop });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
